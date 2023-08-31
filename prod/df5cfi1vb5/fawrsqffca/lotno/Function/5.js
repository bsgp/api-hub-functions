module.exports = async (draft, { request, sql, getUser }) => {
  const { method, table } = draft.pipe.json;
  if (method !== "GET") {
    return;
  }

  const like = request.params.like;
  const created_at = request.params.created_at;
  const eq = request.params.eq;
  const includeDeleted = Object.prototype.hasOwnProperty.call(
    request.params,
    "include_deleted"
  );

  //   const { type } = util;

  const query = sql("mysql").select(table).orderBy("UPDATED_AT", "desc");
  if (like) {
    query.where("LOTNO", "like", like);
  }
  if (eq) {
    query.where("LOTNO", eq);
  }
  if (created_at) {
    const seoulDateTime = [created_at, "00:00:00", "+0900"].join(" ");
    const beginTimestamp = Date.parse(seoulDateTime);
    const beginDate = new Date(beginTimestamp)
      .toISOString()
      .replace(/\.\d{3}/, "");
    const endTimestamp = beginTimestamp + 1000 * 3600 * 24;
    const endDate = new Date(endTimestamp).toISOString().replace(/\.\d{3}/, "");

    query
      .where("CREATED_AT", ">=", beginDate)
      .where("CREATED_AT", "<", endDate);
    // draft.response.body = { beginDate, endDate };
  }
  if (!includeDeleted) {
    query.where("DELETED", false);
  }

  const result = await query.run();

  const userKeys = Object.keys(
    result.body.list.reduce((acc, row) => {
      acc[row.CREATED_BY] = "";
      return acc;
    }, {})
  ).filter(Boolean);

  const users = await getUser("-", { keys: userKeys, fields: ["name", "key"] });

  const usersByKey = users.reduce((acc, user) => {
    acc[user.key] = user;
    return acc;
  }, {});

  result.body.list.forEach((each) => {
    const user = usersByKey[each.CREATED_BY];
    if (user) {
      each.CREATED_BY = user.name;
    }
  });

  draft.response = result;
};
