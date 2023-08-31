module.exports = async (draft, { request }) => {
  const routeTo = {
    exit: "Output#2",
    select: "Function#4",
    create: "Function#5",
    alter: "Function#6",
  };
  const requiredParamTypes = {
    select: {
      tableName: "string",
    },
    create: {
      tableName: "string",
      columns: "array",
      primaryKeys: "array",
    },
    alter: {
      tableName: "string",
      columns: "array",
      primaryKeys: "array",
    },
  };

  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  // if (!checkAdmin(request.headers["bsg-support-user-id"])) {
  //   setFailedResponse("Not authorized", 403);
  //   return;
  // }

  switch (request.method) {
    case "GET": {
      if (!checkParams(requiredParamTypes.select, request.body)) {
        setFailedResponse(
          [
            "Either of these parameters is missing or not correct > [",
            Object.keys(requiredParamTypes.select).join(", "),
            "]",
          ].join("")
        );
        break;
      }

      draft.json.queryData = request.body;
      draft.json.nextNodeKey = routeTo.select;
      break;
    }
    case "POST": {
      if (!checkParams(requiredParamTypes.create, request.body)) {
        setFailedResponse(
          [
            "Either of these parameters is missing or not correct > [",
            Object.keys(requiredParamTypes.create).join(", "),
            "]",
          ].join("")
        );
        break;
      }

      draft.json.createQuery = request.body;
      draft.json.nextNodeKey = routeTo.create;
      break;
    }
    case "PUT":
    case "PATCH": {
      if (!checkParams(requiredParamTypes.alter, request.body)) {
        setFailedResponse(
          [
            "Either of these parameters is missing or not correct > [",
            Object.keys(requiredParamTypes.alter).join(", "),
            "]",
          ].join("")
        );
        break;
      }

      draft.json.alterQuery = request.body;
      draft.json.nextNodeKey = routeTo.alter;
      break;
    }
    default: {
      setFailedResponse("Not available method");
    }
  }
};

function checkParams(requiredParamType, requestBody) {
  const requestBodyKeys = Object.keys(requestBody);
  const requiredParamTypeKeys = Object.keys(requiredParamType);

  return requestBodyKeys.every((reqBodyKey) => {
    if (!requiredParamTypeKeys.includes(reqBodyKey)) {
      return false;
    }
    switch (requiredParamType[reqBodyKey]) {
      case "array": {
        if (!Array.isArray(requestBody[reqBodyKey])) {
          return false;
        }
        break;
      }
      case "object": {
        if (typeof requestBody[reqBodyKey] !== "object") {
          return false;
        }
        break;
      }
      case "string": {
        if (typeof requestBody[reqBodyKey] !== "string") {
          return false;
        }
        break;
      }
      default: {
        return false;
      }
    }
    return true;
  });
}

// function checkAdmin(currentUser) {
//   return ["jhcho"].includes(currentUser);
// }
