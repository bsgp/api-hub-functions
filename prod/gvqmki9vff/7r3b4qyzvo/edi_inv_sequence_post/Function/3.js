module.exports = async (draft, { request, lib, util, file }) => {
  const { tryit } = lib;
  const { isFalsy } = lib.type;

  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = 400;
  };

  if (isFalsy(tryit(() => request.body))) {
    getFailedRes("Body is required");
    return;
  }

  // body: {
  //   "INV_ID": "",
  //   "CUSTOMER": ""
  // }
  let validation = true;
  const body = tryit(() => util.upKeys(request.body), {});
  const bodyKey = ["ID", "INV_ID", "CUSTOMER"];
  if (bodyKey.find((key) => !Object.keys(body).includes(key))) {
    validation = false;
    return getFailedRes("Wrong key");
  }

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.validation = validation;
  draft.pipe.json.reqBody = body;
  draft.pipe.json.tables = tables;

  draft.response.body = {
    reqest: { body },
    tables,
  };
};
