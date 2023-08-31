module.exports = async (draft, { sql }) => {
  const { method } = draft.pipe.json;
  if (method !== "GET") {
    return;
  }

  const { table, options } = draft.pipe.json;
  const baseQuery = sql("mysql")
    .select(table)
    .where(queryNotDeleted);
  const { statusCode, body } = await getQueryResponse(options, baseQuery);

  draft.response.statusCode = 200;
  if (statusCode > 299) {
    draft.response.body = { code: "F", count: 0, list: [] };
    return;
  }
  draft.response.body = { ...body, code: "S" };
};

/* tools */
function queryNotDeleted() {
  this.whereNull("deleted").orWhere({ deleted: false });
}

async function getQueryResponse(options, knexBuilder) {
  const hasOptions = !!Object.keys(options).length;
  if (hasOptions) {
    return await knexBuilder.andWhere(options).run();
  }
  return await knexBuilder.run();
}
