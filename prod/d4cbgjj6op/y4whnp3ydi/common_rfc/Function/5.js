module.exports = async (draft, { request, file, lib }) => {
  if (request.method !== "POST") {
    draft.response.body = {
      errorMessage: "HTTP Method must be 'POST'",
    };
    draft.response.statusCode = 400;
    return;
  }

  const ifList = await file.get("if/list.json", {
    gziped: true,
    toJSON: true,
  });

  const { tryit } = lib;
  const { isFalsy } = lib.type;

  if (isFalsy(ifList)) {
    draft.response.body = {
      errorMessage: "Can not find interface list",
    };
    draft.response.statusCode = 500;
    return;
  }

  if (isFalsy(tryit(() => request.body.InterfaceId))) {
    draft.response.body = {
      errorMessage: "InterfaceId is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.FunctionName))) {
    draft.response.body = {
      errorMessage: "FunctionName is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  const ifItem = tryit(() => ifList[request.body.InterfaceId]);
  if (isFalsy(ifItem)) {
    draft.response.body = {
      errorMessage: "Can not find interface item using provided Interface ID",
    };
    draft.response.statusCode = 400;
    return;
  }

  const fnFromIf = tryit(() => ifItem.FunctionName);
  if (isFalsy(fnFromIf)) {
    draft.response.body = {
      errorMessage: "Can not find function name using provided Interface ID",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (fnFromIf !== request.body.FunctionName) {
    draft.response.body = {
      errorMessage:
        "The function name does not matched with pre-defined interface item",
    };
    draft.response.statusCode = 400;
    return;
  }

  const { requestTimeArray } = request;

  const requestTime = requestTimeArray.join("-");

  if (requestTime < "2021-10-07-15-00") {
    if (request.body.InterfaceId.startsWith("IF_PR00")) {
      draft.response.body = {
        errorMessage: [
          "금일(10/7) PRM 회계 임시점검이 지연되는 관계로",
          "내일부터 정상적으로 사용 가능할것 같습니다.",
          "사용중 불편을 드려 대단히 죄송합니다.",
        ].join(" "),
      };
      draft.response.statusCode = 400;
      return;
    }
  }

  if (isFalsy(tryit(() => request.body.Parameters.I_UIDNT))) {
    draft.response.body = {
      errorMessage: "I_UIDNT in Parameters is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.Parameters.I_UTEXT))) {
    draft.response.body = {
      errorMessage: "I_UTEXT in Parameters is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.Parameters.I_SYSID))) {
    draft.response.body = {
      errorMessage: "I_SYSID in Parameters is required",
    };
    draft.response.statusCode = 400;
    return;
  }
};
