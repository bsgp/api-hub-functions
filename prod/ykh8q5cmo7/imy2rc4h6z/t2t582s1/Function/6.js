module.exports = async (draft, { request, sql, log }) => {
  const { method, skip } = draft.pipe.json;
  if (method !== "PATCH" || skip) {
    return;
  }

  const { table, list } = draft.pipe.json;
  draft.response.statusCode = 200;

  if (!list.length) {
    draft.response.body = {
      code: "S",
      count: 0,
      list: []
    };
    return;
  }

  const builder = sql("mysql");
  const multiBuilder = builder.multi(table);
  list.forEach(each => {
    multiBuilder.add(function() {
      this.update({ ...each, UPDATED_AT: builder.fn.now(6) }).where({
        UUID: each.UUID
      });
    });
  });

  const { statusCode, body } = await multiBuilder.run();
  if (statusCode > 299) {
    draft.response.body = {
      code: "F",
      count: 0,
      list: []
    };
    return;
  }
  draft.response.body = formalizeMultiPatchResponse(body, list);
};

function formalizeMultiPatchResponse(sqlMultiResponseBody, payloads) {
  const { code, list } = sqlMultiResponseBody;
  const successList = list
    .filter(({ code }) => code === "S")
    .map(({ index }) => payloads[index]);
  return { code, count: successList.length, list: successList };
}
