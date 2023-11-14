const returnResError = (body, prefixMessage) => {
  /*{
    "access_token": "87158447-1b65-4079-938d-68030d3bc5fa",
    "token_type": "bearer",
    "expires_in": 26663,
    "scope": "read write"
  }*/
  const err = new Error([prefixMessage].filter(Boolean).join(", "));

  try {
    err.description = "JSON.stringify(body);\n" + JSON.stringify(body);
  } catch (ex) {
    // pass
  }

  throw err;
};

const checkResError = (body, prefixMessage) => {
  /*{
    "access_token": "87158447-1b65-4079-938d-68030d3bc5fa",
    "token_type": "bearer",
    "expires_in": 26663,
    "scope": "read write"
  }*/
  if (body.success === true) {
    // if (body.payload.length === 0) {
    //   returnResError(body, prefixMessage);
    // }
  } else {
    returnResError(body, prefixMessage);
  }
};

module.exports.getToken = async ({ restApi }) => {
  const body = {};

  const queryObj = {
    client_id: "e14d1b82-c658-40b6-b4fe-87b3bd3fcd64",
    client_secret: "f7befe83-c90d-43ce-a229-46981e71b17b",
    grant_type: "client_credentials",
  };

  const res = await restApi.post({
    url: [
      "https://bsgpartners.api.groupware.pro/v1/oauth/token",
      Object.keys(queryObj)
        .map((key) => `${key}=${queryObj[key]}`)
        .join("&"),
    ].join("?"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body,
  });

  const result = res.body.access_token;

  if (!result) {
    returnResError(res.body, "Failed to get token from gpro");
  }

  return result;
};

module.exports.getEmployeesList = async (token, { restApi }) => {
  const result = await restApi.get({
    url: ["https://bsgpartners.api.groupware.pro/v1/eai/employees"].join("?"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: ["Bearer", token].join(" "),
    },
    body: {},
  });

  checkResError(result.body, "Failed to get 임직원 list");

  return result.body.payload;
};

module.exports.getAssignmentsList = async (token, { restApi }) => {
  const result = await restApi.get({
    url: [
      "https://bsgpartners.api.groupware.pro/v1/eai/employees/assignments",
    ].join("?"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: ["Bearer", token].join(" "),
    },
    body: {},
  });

  checkResError(result.body, "Failed to get 발령 list");

  return result.body.payload;
};

module.exports.getOrganizationsList = async (token, { restApi }) => {
  const result = await restApi.get({
    url: ["https://bsgpartners.api.groupware.pro/v1/eai/organizations"].join(
      "?"
    ),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: ["Bearer", token].join(" "),
    },
    body: {},
  });

  checkResError(result.body, "Failed to get 부서 list");

  return result.body.payload;
};

module.exports.reverseFiDocument = async (token, body, { restApi }) => {
  const result = await restApi.post({
    url: [
      "https://bsgpartners.wf.api.groupware.pro/v1/fn/preDocument/cancel/sap",
    ].join("?"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: ["Bearer", token].join(" "),
    },
    body,
  });

  checkResError(result.body, "역분개 실패");

  return result.body.payload;
};
