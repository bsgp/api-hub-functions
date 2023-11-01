const checkResError = (body, prefixMessage) => {
  /*{
    "status": "200",
    "message": "통신이 처리 되었습니다.",
    "response": {
        "resultCode": "-1",
        "message": "인증키값이 유효 하지 않습니다."
    }
  }*/
  if (body.response) {
    if (body.response.resultCode === "-1") {
      const err = new Error(
        [prefixMessage, body.response.message].filter(Boolean).join(", ")
      );

      try {
        err.description = "JSON.stringify(body);\n" + JSON.stringify(body);
      } catch (ex) {
        // pass
      }

      throw err;
    }
  }
};

module.exports.getToken = async ({ restApi }) => {
  const body = {};

  const queryObj = {
    client_id: "e14d1b82-c658-40b6-b4fe-87b3bd3fcd64",
    client_secret: "f7befe83-c90d-43ce-a229-46981e71b17b",
    grant_type: "client_credentials",
  };

  const result = await restApi.get({
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

  checkResError(result.body, "Failed to get token from unipost");

  return result.body.access_token;
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
