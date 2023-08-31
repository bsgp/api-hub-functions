module.exports = async (draft, { request, lib, file }) => {
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
  //   "InterfaceID": "SRM_CREATE_IDN",
  //   "Function": {
  //     "UserID": "bbb",
  //     "UserText": "tUser",
  //     "SysID": "SUPPORT",
  //     "Type": "DB",
  //     "Name": "CREATE, UPDATE SRM IDN"
  //   },
  //   "Data": {
  //     "poItems": [],
  //     "idnHeader": [],
  //     "idnItems": [],
  //   }
  // }

  const body = tryit(() => request.body, {});
  let validation = true;
  if (typeof body !== "object") {
    validation = false;
    return getFailedRes("Typeof Body is wrong");
  }
  const interfaceList = ["SRM_CREATE_APPROVAL", "SRM_CREATE_IDN"];
  const InterfaceID = body.InterfaceID;
  if (!interfaceList.includes(InterfaceID)) {
    validation = false;
    return getFailedRes("Wrong InterfaceID");
  }
  const functionKey = ["UserID", "UserText", "SysID", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    validation = false;
    return getFailedRes("Wrong Function key");
  }

  const dataList = ["poItems", "idnHeader", "idnItems"];
  const data = body.Data;
  if (!data || Object.keys(data).find((key) => !dataList.includes(key))) {
    validation = false;
    return getFailedRes("Wrong Data");
  }

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.validation = validation;
  draft.pipe.json.reqBody = body;
  draft.pipe.json.Data = data;
  draft.pipe.json.InterfaceID = InterfaceID;
  draft.pipe.json.tables = tables;

  draft.response.body = {
    request: { InterfaceID, data, user: body.Function.UserID },
    tables,
  };
};
