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

  if (isFalsy(tryit(() => request.body.Function))) {
    draft.response.body = {
      errorMessage: "Function is required",
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

  const typeFromIf = tryit(() => ifItem.Type);
  if (isFalsy(typeFromIf)) {
    draft.response.body = {
      errorMessage: "Can not find 'Type' using provided Interface ID",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (typeFromIf !== request.body.Function.Type) {
    draft.response.body = {
      errorMessage:
        "The function type does not matched with pre-defined interface item",
    };
    draft.response.statusCode = 400;
    return;
  }

  const nameFromIf = tryit(() => ifItem.Name);
  if (isFalsy(nameFromIf)) {
    draft.response.body = {
      errorMessage: "Can not find 'Name' using provided Interface ID",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (nameFromIf !== request.body.Function.Name) {
    draft.response.body = {
      errorMessage:
        "The function name does not matched with pre-defined interface item",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.Function.UserId))) {
    draft.response.body = {
      errorMessage: "UserId in Function is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.Function.UserText))) {
    draft.response.body = {
      errorMessage: "UserText in Function is required",
    };
    draft.response.statusCode = 400;
    return;
  }

  if (isFalsy(tryit(() => request.body.Function.SysId))) {
    draft.response.body = {
      errorMessage: "SysId in Function is required",
    };
    draft.response.statusCode = 400;
    return;
  }
};
