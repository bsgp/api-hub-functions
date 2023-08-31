module.exports = async (draft, { request, lib, file }) => {
  const { tryit } = lib;
  const { isFalsy } = lib.type;
  const method = request.method;

  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = 400;
  };
  if (isFalsy(tryit(() => request.body))) {
    getFailedRes("Body is required");
    return;
  }
  // body: {
  //   "InterfaceId": "CMS_DATA_REQUEST",
  //   "Function": {
  //     "UserId": "bbb",
  //     "UserText": "tUser",
  //     "SysId": "SUPPORT",
  //     "Type": "DB",
  //     "Name": "CMS DATA request"
  //   },
  //   "Data": {
  //     "create": [{}],
  //     "update": [{}],
  //     "delete": [{}]
  //   },
  //   "DB": "system"
  // }

  const body = tryit(() => request.body, {});
  let validation = true;
  if (typeof body !== "object") {
    validation = false;
    return getFailedRes("Typeof Body is wrong");
  }
  if (body.InterfaceId !== "CMS_DATA_REQUEST") {
    validation = false;
    return getFailedRes("Wrong InterfaceId");
  }
  const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    validation = false;
    return getFailedRes("Wrong Function key");
  }
  const dbName = body.DB;
  const dbList = ["system", "tax", "ledger", "constCenter"];
  if (!dbList.includes(dbName)) {
    validation = false;
    return getFailedRes("Wrong DB");
  }
  const dbMethod = ["create", "update", "delete"];
  const data = body.Data;
  if (!data || Object.keys(data).find((key) => !dbMethod.includes(key))) {
    validation = false;
    return getFailedRes("Wrong Data");
  }

  const result = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.validation = validation;
  draft.pipe.json.reqBody = body;
  draft.pipe.json.Data = data;
  draft.pipe.json.httpMethod = method;
  draft.pipe.json.table = result[body.DB].name;
  draft.response.body = {
    validation,
    method,
    table: result[body.DB].name,
    data,
    user: body.Function.UserId,
  };
};
