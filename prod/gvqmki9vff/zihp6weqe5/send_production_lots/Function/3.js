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
  //     "InterfaceId": "PRODUCTION_LOTS_001",
  //     "Function": {
  //       "UserId": "user1",
  //       "UserText": "tUser",
  //       "SysId": "SUPPORT",
  //       "Type": "TRANSACTION",
  //       "Name": "SendProductionLotsToBYD",
  //     },
  //     "Data": {}, // state
  //     "Type": "",
  //     "Pid": ""
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

  if (body.InterfaceId !== "PRODUCTION_LOTS_001") {
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
  if (typeof body.Data !== "object") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Wrong Request",
    };
    draft.response.statusCode = 400;
    return;
  }
  const postingDate = new Date(
    `${body.Data.form.postingDate}T00:00:00.000-04:00`
  );
  const lotBatchDate = new Date(
    `${body.Data.form.lotBatchDate}T00:00:00.000-04:00`
  );
  const today = new Date();
  today.setUTCHours(4);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);

  if (today.valueOf() < postingDate.valueOf()) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Selected posting Date is in the future",
      result: {
        postingDate: postingDate.toJSON(),
        today: today.toJSON(),
        dmDate: new Date(today.valueOf() - 1000 * 3600 * 4).toJSON(),
      },
    };
    draft.response.statusCode = 400;
    return;
  } else if (today.valueOf() < lotBatchDate.valueOf()) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Selected LotBatch Date is in the future",
    };
    draft.response.statusCode = 400;
    return;
  }
  const uniqueKey = `${Date.now() + Math.random()}`;
  draft.pipe.json.uniqueKey = uniqueKey.replace(/\./g, "");
  draft.pipe.json.data = body.Data;
  draft.pipe.json.validate = true;
};
