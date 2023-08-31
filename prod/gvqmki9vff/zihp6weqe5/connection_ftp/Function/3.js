module.exports = async (draft, context) => {
  const { request, lib } = context;
  if (request.method !== "POST") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "HTTP Method must be 'POST'",
    };
    draft.response.statusCode = 400;
    return;
  }

  const { tryit } = lib;
  const { isFalsy } = lib.type;

  if (isFalsy(tryit(() => request.body))) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Body is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  // body: {
  //     "InterfaceId": "HIGHWAY_001",
  //     "Function": {
  //       "UserId": "user1",
  //       "UserText": "tUser",
  //       "SysId": "BYD",
  //       "Type": "FTP",
  //       "Name": "SendProductionOrderToFTP",
  //     },
  //     "Data": "0,CASELBPR,FERT_001,develop4,20211105,043753"
  // }

  const body = tryit(() => request.body, {});

  if (typeof body !== "object") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Typeof Body is wrong",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (body.InterfaceId !== "HIGHWAY_001") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Wrong InterfaceId",
    };
    draft.response.statusCode = 400;
    return;
  }
  const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Wrong Function key",
    };
    draft.response.statusCode = 400;
    return;
  }
  if (!body.Data || body.Data.split(",").length !== 6) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Wrong Data",
    };
    draft.response.statusCode = 400;
    return;
  }
  draft.pipe.json.validate = true;
};
