const uuid = require("uuid");

module.exports = async (draft, { sql, log }) => {
  const { method, skip } = draft.pipe.json;
  if (method !== "POST" || skip) {
    return;
  }

  draft.response.statusCode = 200;
  const resBody = {
    code: "F",
    count: 0,
    list: []
  };

  const { table, unique: uniqueColumnHeaders, list } = draft.pipe.json;

  const builder = sql("mysql");

  const uniqueValueSets = list.map(each => {
    return uniqueColumnHeaders.map(uniqCol => each[uniqCol]);
  });

  const overlapNotDeleted = await builder
    .select(table)
    .whereIn(uniqueColumnHeaders, uniqueValueSets)
    .andWhere(isNotDeleted)
    .run();

  if (overlapNotDeleted.body.count) {
    log("posted duplicate item.");
    draft.response.body = resBody;
    return;
  }

  const overlapDeleted = await builder
    .select(table)
    .whereIn(uniqueColumnHeaders, uniqueValueSets)
    .andWhere({ deleted: true })
    .run();
  const patchOnDeleted = overlapDeleted.body.list;
  const patchOnDeletedList = patchOnDeleted.map(each => {
    const row = getUniqueMatch(list, each, uniqueColumnHeaders);
    return { ...row, UUID: each.UUID };
  });

  const multiBuilder = builder.multi(table);
  patchOnDeletedList.forEach(row => {
    multiBuilder.add(function() {
      this.update({ ...row, DELETED: false }).where({ UUID: row.UUID });
    });
  });

  const postOnNew = list
    .filter(row => {
      return !getUniqueMatch(patchOnDeleted, row, uniqueColumnHeaders);
    })
    .map(row => ({ ...row, UUID: uuid.v4() }));

  if (patchOnDeleted.length) {
    const { statusCode, body } = await multiBuilder.run();
    if (statusCode < 300) {
      Object.assign(
        resBody,
        formalizeMultiPatchResponse(body, patchOnDeletedList)
      );
    }
  }

  if (postOnNew.length) {
    const { statusCode, body } = await builder.insert(table, postOnNew).run();
    if (statusCode > 299) {
      const newCodeOnFail = resBody.count ? "P" : "F";
      Object.assign(resBody, { code: newCodeOnFail });
      return;
    }
    const newCode = !patchOnDeleted.length || resBody.code === "S" ? "S" : "P";
    const newCount = resBody.count + body.count;
    const newList = patchOnDeletedList.concat(postOnNew);
    Object.assign(resBody, { code: newCode, count: newCount, list: newList });
  }

  draft.response.body = resBody;
};

/* tools */
function formalizeMultiPatchResponse(sqlMultiResponseBody, payloads) {
  const { code, list } = sqlMultiResponseBody;
  const successList = list
    .filter(({ code }) => code === "S")
    .map(({ index }) => payloads[index]);
  return { code, count: successList.length, list: successList };
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
