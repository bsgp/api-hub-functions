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
  //     "InterfaceId": "LG_DM_LOG_DB",
  //     "Function": {
  //       "UserId": "user1",
  //       "UserText": "tUser",
  //       "SysId": "SUPPORT",
  //       "Type": "DB"
  //       "Name": "LG(DM) Transaction log",
  //     },
  //     "Data": {
  //       "DOC_ID": "",
  //       "TYPE": ""
  //     }
  // }
  const body = tryit(() => request.body, {});

  if (typeof body !== "object") {
    getFailedRes("Typeof Body is wrong");
    return;
  }
  if (body.InterfaceId !== "LG_DM_LOG_DB") {
    getFailedRes("Wrong InterfaceId");
    return;
  }
  const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    getFailedRes("Wrong Function key");
    return;
  }
  const data = body.Data;
  const primaryKeys = [
    "TYPE",
    "TASK_STEP",
    "MATERIAL_ID",
    "ISTOCK_ID",
    "QUANTITY",
    "AREA",
    "CREATED_BY",
    "UNIQUE_KEY",
  ];
  let isSatisfied = true;
  const noKeyList = [];
  primaryKeys.forEach((key) => {
    if (!Object.keys(data).includes(key)) {
      isSatisfied = false;
      noKeyList.push(key);
    }
  });
  // if (!isSatisfied) {
  //   getFailedRes(`Wrong Data, Need: '${noKeyList.join("' and '")}'`);
  //   return;
  // }

  const result = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  draft.pipe.json.table = result.log.name;
  draft.pipe.json.validation = true;
  draft.pipe.json.isSatisfied = isSatisfied;
};
