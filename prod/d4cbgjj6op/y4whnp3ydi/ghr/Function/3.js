module.exports = async (draft, { request, file, lib }) => {
  if (!["POST", "TASK"].includes(request.method)) {
    draft.response.body = {
      errorMessage: "HTTP Method must be 'POST'",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
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
    draft.pipe.json.terminateFlow = true;
    return;
  }

  if (isFalsy(tryit(() => request.body.InterfaceId))) {
    draft.response.body = {
      errorMessage: "InterfaceId is required",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  if (isFalsy(tryit(() => request.body.DbTable))) {
    draft.response.body = {
      errorMessage: "DbTable is required",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  const ifItem = tryit(() => ifList[request.body.InterfaceId]);
  if (isFalsy(ifItem)) {
    draft.response.body = {
      errorMessage: "Can not find interface item using provided Interface ID",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  const fnFromIf = tryit(() => ifItem.DbTable);
  if (isFalsy(fnFromIf)) {
    draft.response.body = {
      errorMessage: "Can not find DB Table using provided Interface ID",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  if (fnFromIf !== request.body.DbTable) {
    draft.response.body = {
      errorMessage:
        "The DB Table does not matched with pre-defined interface item",
    };
    draft.response.statusCode = 400;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  if (request.method === "POST") {
    if (isFalsy(tryit(() => request.body.Meta.I_UIDNT))) {
      draft.response.body = {
        errorMessage: "I_UIDNT in Meta is required",
      };
      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }

    if (isFalsy(tryit(() => request.body.Meta.I_UTEXT))) {
      draft.response.body = {
        errorMessage: "I_UTEXT in Meta is required",
      };
      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }

    if (isFalsy(tryit(() => request.body.Meta.I_SYSID))) {
      draft.response.body = {
        errorMessage: "I_SYSID in Meta is required",
      };
      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }
  }
};
