module.exports = async (draft, { request, file }) => {
  // your script
  if (request.method !== "GET") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed: Wrong Request method`,
    };
    return;
  }
  try {
    const tables = await file.get("config/commentsTables.json", {
      gziped: true,
      toJSON: true,
    });
    draft.pipe.json.tables = tables;
    // draft.pipe.json.tables = JSON.stringify(tables);
    draft.response.body = {};
  } catch (err) {
    console.log("에러", err);
    // draft.response.body = { err };
    draft.response.body.E_STATUS = "N";
    draft.response.body.E_MESSAGE = "DB 테이블 존재하지 않음";
    return;
  }
};
