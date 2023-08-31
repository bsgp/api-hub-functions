module.exports = async (draft, { request, file }) => {
  const { method } = request;

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true
  });

  const { table, unique, options } = getReqTableInfo(tables, request);
  Object.assign(draft.pipe.json, { method, table, unique });

  if (["POST", "PATCH"].includes(method)) {
    const list = getReqDataList(request);
    if (!list.length) {
      Object.assign(draft.pipe.json, { skip: true });
      draft.response.statusCode = 200;
      draft.response.body = {
        code: "S",
        count: 0,
        list: []
      };
      return;
    }
    Object.assign(draft.pipe.json, { list });
  }

  if (method === "GET") {
    Object.assign(draft.pipe.json, { options });
  }
};

/* tools */
function getReqTableInfo(tableInfos, req) {
  const { type, ...options } = req.params || {};
  const { name, unique } = tableInfos[type.toLowerCase()] || {};
  if (!name) throw new Error("Cannot find table name at getReqTable.");
  return { table: name, unique, options };
}

function getReqDataList(req) {
  const { data } = req.body || {};
  if (typeof data !== "object")
    throw new Error("Data is not proper. Should be object");
  if (Array.isArray(data)) return data;
  return [data];
}
