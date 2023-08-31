module.exports = async (draft, context) => {
  const { request, lib, file } = context;
  const { tryit } = lib;
  const { isFalsy } = lib.type;

  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = 400;
  };
  if (request.method !== "POST") {
    getFailedRes("Failed: Wrong Request method");
    return;
  }
  if (isFalsy(tryit(() => request.body))) {
    getFailedRes("Body is required");
    return;
  }
  // body: {
  //     "InterfaceId": "UPDATE_EXCHANGE_DATA",
  //     "Function": {
  //       "UserId": "user1",
  //       "UserText": "tUser",
  //       "SysId": "SUPPORT",
  //       "Type": "DB"
  //       "Name": "Update exchange DB Data",
  //     },
  //     "Data": {
  //       "BASIC_DATE",
  //       "BASIC_SEQ",
  //       "CURR_CD",
  //       "BASIC_TIME",
  //       "BASIC_RATE",
  //     }
  // }
  const body = tryit(() => request.body, {});

  if (typeof body !== "object") {
    getFailedRes("Typeof Body is wrong");
    return;
  }
  if (body.InterfaceId !== "UPDATE_EXCHANGE_DATA") {
    getFailedRes("Wrong InterfaceId");
    return;
  }
  const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    getFailedRes("Wrong Function key");
    return;
  }

  const result = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  draft.pipe.json.table = result.log.name;
  draft.pipe.json.validation = true;
};
