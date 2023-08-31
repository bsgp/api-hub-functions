function findUndefinedKeys(obj, keys) {
  return (
    keys
      // .filter((key) => exceptionKeys.includes(key) === false)
      .filter((key) => obj[key] === undefined)
  );
}
function findNotHaveValue(obj, keys) {
  return keys.filter((key) => !obj[key]);
}
module.exports = async (draft, { request, file, lib, env }) => {
  const { isFalsy } = lib.type;
  // const isObject = lib.type.isObject;

  function resFalsyError(message, status = 400) {
    const { response, json } = draft;
    response.body = { errorMessage: message };
    response.statusCode = status;
    json.terminateFlow = true;
  }

  function findUnmatchedType(obj, keysTypes) {
    return keysTypes.filter((each) => {
      const typeAnyMatched = each[1].reduce((acc, typeFunction) => {
        if (acc === true) {
          return acc;
        }
        return lib.type[typeFunction](obj[each[0]]);
      }, false);
      return !typeAnyMatched;
    });
  }

  if (request.method !== "POST")
    return resFalsyError("HTTP Method must be 'POST'");

  const ifList = await file.get("if/list.json", {
    gziped: true,
    toJSON: true,
  });

  if (isFalsy(ifList)) return resFalsyError("Can not find interface list", 500);

  // check body
  const undefinedInBody = findUndefinedKeys(request.body, [
    "InterfaceId",
    "Function",
    "Data",
  ]);

  if (undefinedInBody.length > 0) {
    const emptyKeys = undefinedInBody.join(", ");
    return resFalsyError(`"${emptyKeys}" is required in body`);
  }

  const unmatchedInBody = findUnmatchedType(request.body, [
    ["InterfaceId", ["isString"]],
    ["Function", ["isObject"]],
    ["Data", ["isArray", "isObject"]],
  ]);

  if (unmatchedInBody.length > 0) {
    const msgList = unmatchedInBody.map((each) => {
      return `"${each[0]}" must match with ${each[1]
        .map((funcName) => funcName)
        .join(" or ")}`;
    });
    return resFalsyError(msgList.join(".\n"));
  }

  const notHaveValueInBody = findNotHaveValue(request.body, ["InterfaceId"]);

  if (notHaveValueInBody.length > 0) {
    const emptyKeys = notHaveValueInBody.join(", ");
    return resFalsyError(`"${emptyKeys}" in body must have valid value`);
  }

  const ifObj = ifList[request.body.InterfaceId];
  if (isFalsy(ifObj)) {
    return resFalsyError(
      `Can not find valid item with IntefaceId "${request.body.InterfaceId}"`
    );
  }

  // check Function
  const undefinedInFunction = findUndefinedKeys(request.body.Function, [
    "UserId",
    "UserText",
    "SysId",
    "Type",
    "Name",
  ]);

  if (undefinedInFunction.length > 0) {
    const emptyKeys = undefinedInFunction.join(", ");
    return resFalsyError(`"${emptyKeys}" is required in body.Function`);
  }

  const unmatchedInFunction = findUnmatchedType(request.body.Function, [
    ["UserId", ["isString"]],
    ["UserText", ["isString"]],
    ["SysId", ["isString"]],
    ["Type", ["isString"]],
    ["Name", ["isString"]],
  ]);

  if (unmatchedInFunction.length > 0) {
    const msgList = unmatchedInFunction.map((each) => {
      return `"${each[0]}" must match with ${each[1]
        .map((funcName) => funcName)
        .join(" or ")}`;
    });
    return resFalsyError(msgList.join(".\n"));
  }

  const notHaveValueInFunction = findNotHaveValue(request.body.Function, [
    "UserId",
    "UserText",
    "SysId",
    "Type",
    "Name",
  ]);

  if (notHaveValueInFunction.length > 0) {
    const emptyKeys = notHaveValueInFunction.join(", ");
    return resFalsyError(
      `"${emptyKeys}" in body.Function must have valid value`
    );
  }

  if (ifObj.Type === "RFC" || ifObj.RfcName) {
    try {
      const connKey = ["SAP", env.CURRENT_ALIAS.toUpperCase()].join("_");
      const connection = JSON.parse(env[connKey]);

      draft.json.rfcConnection = { ...connection };
    } catch (ex) {
      return resFalsyError(`RFC 접속정보를 찾지 못했습니다`);
    }
  }

  draft.json.ifObj = ifObj;
};
