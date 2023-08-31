module.exports = async (draft, context) => {
  const { request, lib } = context;
  const { tryit } = lib;
  const { isFalsy } = lib.type;

  const getFailedRes = (msg, detail) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg, detail };
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
  //   "InterfaceId": "JEIL_COMPOSITE_BY_SO",
  //   "Function": {
  //     "UserId": "user1",
  //     "UserText": "tUser",
  //     "SysId": "SUPPORT",
  //     "Type": "BYD",
  //     "Name": "JEIL mycompositeBySo api",
  //   },
  //   "pid": "",
  //   "id": "",
  //   "type": ""
  //  }
  const body = tryit(() => request.body, {});

  if (typeof body !== "object") {
    getFailedRes("Typeof Body is wrong");
    return;
  }
  if (body.InterfaceId !== "JEIL_COMPOSITE_BY_SO") {
    getFailedRes("Wrong InterfaceId");
    return;
  }
  if (!body.Function) {
    getFailedRes("No Function");
    return;
  }
  const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    getFailedRes(
      "Wrong Function key",
      functionKey.find((key) => !Object.keys(body.Function).includes(key))
    );
    return;
  }
  const primaryKeys = ["pid", "id", "type"];
  let isSatisfied = true;
  const noKeyList = [];
  primaryKeys.forEach((key) => {
    if (!Object.keys(body).includes(key)) {
      isSatisfied = false;
      noKeyList.push(key);
    }
  });
  if (!isSatisfied) {
    getFailedRes(`Wrong Body, Need: '${noKeyList.join("' and '")}'`);
    return;
  }
  draft.pipe.json.validate = isSatisfied;
  draft.pipe.json.pid = body.pid;
  draft.pipe.json.id = body.id;
  draft.pipe.json.type = body.type;
};
