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
  const { isFalsy, isObject, tryit, repeat } = lib;
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

  if (!["POST", "TASK"].includes(request.method))
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

  const ifObj = { ...ifList[request.body.InterfaceId] };
  ifObj.InterfaceId = request.body.InterfaceId;

  if (isFalsy(ifObj)) {
    return resFalsyError(
      [
        `Can not find valid item with IntefaceId "${request.body.InterfaceId}"`,
        "Please check following link",
        "https://rainy-judo-16e.notion.site/a50455b760074f66bc1f02e6de6dc1b0",
      ].join(" ")
    );
  }

  if (ifObj.UrlPath || ifObj.Type === "DB") {
    const ifIdPrefix = request.body.InterfaceId.replace(/\d{0,}$/, "");
    const ifSystem = ifList.prefixes[ifIdPrefix];
    if (isFalsy(ifSystem)) {
      return resFalsyError(
        `Can not find valid prefix with "${request.body.InterfaceId}"`
      );
    }

    let ifDomain = request.stage;

    repeat(() => {
      ifDomain = tryit(() => ifList.systems[ifSystem].domains[ifDomain]);

      if (isFalsy(ifDomain)) {
        return { break: true };
      }
      if (ifObj.Type === "DB") {
        if (ifDomain.startsWith("DB:")) {
          return { break: true };
        }
      } else {
        if (ifDomain.startsWith("http")) {
          return { break: true };
        }
      }
    });

    let invalidDomain = false;
    if (isFalsy(ifDomain)) {
      invalidDomain = true;
    } else if (ifObj.Type === "DB") {
      if (!ifDomain.startsWith("DB:")) {
        invalidDomain = true;
      }
    } else if (!ifDomain.startsWith("http")) {
      invalidDomain = true;
    }

    if (invalidDomain === true) {
      return resFalsyError(
        `Can not find valid domain with "${request.body.InterfaceId}"`
      );
    }

    if (ifObj.Type === "DB") {
      ifDomain = ifDomain.replace("DB:", "");

      let ifDbName = request.stage;

      repeat(() => {
        const newDbName = tryit(
          () => ifList.systems[ifSystem].dbNames[ifDbName]
        );

        if (isFalsy(newDbName)) {
          return { break: true };
        }

        ifDbName = newDbName;
      });

      let invalidDbName = false;
      if (isFalsy(ifDbName)) {
        invalidDbName = true;
      }

      if (invalidDbName === true) {
        return resFalsyError(
          `Can not find valid DB Name with "${request.body.InterfaceId}"`
        );
      }
      ifObj.DbName = ifDbName;
    }

    ifObj.Url = [ifDomain, ifObj.UrlPath].join("");
    ifObj.Domain = ifDomain;

    let ifHeaders = request.stage;

    repeat(() => {
      ifHeaders = tryit(() => ifList.systems[ifSystem].headers[ifHeaders]);

      if (isFalsy(ifHeaders)) {
        return { break: true };
      }
      if (isObject(ifHeaders)) {
        return { break: true };
      }
    });

    ifObj.HttpHeaders = {
      ...ifObj.HttpHeaders,
      ...ifHeaders,
    };
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

  if (request.body.Function.Type !== ifObj.Type) {
    return resFalsyError(
      `body.Function.Type의 값이 정확한 인터페이스 정보와 일치하지 않습니다.`
    );
  }

  if (request.path && ifObj.Path) {
    if (request.path === "unknown") {
      // pass
    } else {
      if (request.path !== ifObj.Path) {
        return resFalsyError(
          `URL Path가 인터페이스 정보와 일치하지 않습니다.${request.path}`
        );
      }
    }
  }

  if (request.body.Function.Name !== ifObj.Name) {
    return resFalsyError(
      `body.Function.Name의 값이 정확한 인터페이스 정보와 일치하지 않습니다.`
    );
  }

  if (ifObj.Type === "RFC" || ifObj.RfcName) {
    try {
      const connKey = ["SAP", env.CURRENT_ALIAS.toUpperCase()].join("_");
      const connection = JSON.parse(env[connKey]);

      draft.json.rfcConnection = { ...connection };
    } catch (ex) {
      return resFalsyError(`RFC 접속정보를 찾지 못했습니다(${ex.message})`);
    }
  }

  draft.json.ifObj = ifObj;
};
