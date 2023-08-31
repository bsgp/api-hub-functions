const uuid = require("uuid");

module.exports = async (draft, { request, sql }) => {
  const { method, table, unique: uniqueColumnHeaders } = draft.pipe.json;

  if (method !== "POST") {
    return;
  }

  const dataRows = request.body.data;

  if (!Array.isArray(dataRows)) {
    sendErrRes("post data should be array type.");
    return;
  }

  if (!dataRows.length) {
    sendErrRes("post data should have one row at least.");
    return;
  }

  const uniqueColumnValues = dataRows.map(each => {
    return uniqueColumnHeaders.map(uniqCol => each[uniqCol]);
  });

  const builder = sql("mysql");

  const rowOverlapNotDeleted = await builder
    .select(table)
    .whereIn(uniqueColumnHeaders, uniqueColumnValues)
    .andWhere(isNotDeleted)
    .run();

  if (rowOverlapNotDeleted.body.count) {
    sendErrRes("duplicate key");
    return;
  }

  const multiBuilder = builder.multi(table);

  const rowOverlapDeleted = await builder
    .select(table)
    .whereIn(uniqueColumnHeaders, uniqueColumnValues)
    .andWhere({ deleted: true })
    .run();

  const patchOnDeleted = rowOverlapDeleted.body.list;

  patchOnDeleted
    .map(each => {
      const row = getUniqueMatch(dataRows, each, uniqueColumnHeaders);
      return { ...row, UUID: each.UUID, DELETED: false };
    })
    .forEach(row => {
      multiBuilder.add(function() {
        this.update(row).where({ UUID: row.UUID });
      });
    });

  const postOnNew = dataRows
    .filter(row => {
      return !getUniqueMatch(patchOnDeleted, row, uniqueColumnHeaders);
    })
    .map(row => ({ ...row, UUID: uuid.v4() }));

  draft.response.statusCode = 200;
  draft.response.body = {
    count: 0,
    list: []
  };

  if (patchOnDeleted.length) {
    const { body: postOnDeletedResponse } = await multiBuilder.run();
    draft.response.body.count += postOnDeletedResponse.count;
    draft.response.body.list = draft.response.body.list.concat(
      postOnDeletedResponse.list
    );
  }

  if (postOnNew.length) {
    const { statusCode, body: postNewResponse } = await builder
      .insert(table, postOnNew)
      .run();
    if (statusCode > 300) {
      draft.response.body.message = "some of insert failed.";
      return;
    }
    draft.response.body.count += postNewResponse.count;
    draft.response.body.list = draft.response.body.list.concat(postOnNew);
  }

  /* tools */
  function sendErrRes(errorMessage) {
    draft.response.statusCode = 400;
    draft.response.body = {
      errorMessage
    };
  }

  function checkMatchByKey(aObj, bObj, targetKeys) {
    const nonMatches = targetKeys.filter(key => {
      return aObj[key] !== bObj[key];
    });
    if (nonMatches.length) return false;
    return true;
  }

  function getUniqueMatch(list, obj, targetKeys) {
    return list.find(listItem => {
      return checkMatchByKey(listItem, obj, targetKeys);
    });
  }

  function isNotDeleted() {
    this.whereNull("deleted").orWhere({ deleted: false });
  }
};
