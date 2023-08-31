module.exports = async (draft, { request, file }) => {
  if (request.method !== "GET") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed: Wrong Request method`,
    };
    return;
  }
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
