module.exports = async (draft, { request, lib }) => {
  const { tryit } = lib;
  const { isFalsy } = lib.type;
  const method = request.method;
  let isValid = true;

  if (method !== "POST") {
    isValid = false;
    draft.response.body = { message: "Not allowed http method" };
  }

  const sampleData = {
    InterfaceID: "POST_BYD_SRM_CONFIG",
    Function: {
      Type: "CONFIG",
      Name: "SET BYD SRM CONFIG",
    },
    Payload: {
      Tenant: "my341545",
      ServiceName: "bsg_purchaseorder",
      Collections: {
        root: "POCollection",
      },
      Extensions: {
        root: {
          confirmIndicatior: "SRM001_KUT",
          confirmDate: "Datetime(SRM002_KUT)",
        },
        items: {},
      },
    },
  };

  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg, sample: sampleData };
    draft.response.statusCode = 400;
  };

  if (isFalsy(tryit(() => request.body))) {
    getFailedRes("Body is required", sampleData);
    return;
  }

  const body = tryit(() => request.body, {});

  if (typeof body !== "object") {
    isValid = false;
    return getFailedRes("Typeof Body is wrong");
  }
  if (body.InterfaceID !== "POST_BYD_SRM_CONFIG") {
    isValid = false;
    return getFailedRes("Wrong InterfaceID");
  }

  const functionKey = ["Type"];
  if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
    isValid = false;
    return getFailedRes("Wrong Function key");
  }
  const payload = tryit(() => body.Payload, {});
  if (!payload.Tenant || !payload.ServiceName || !payload.Collections) {
    isValid = false;
    return getFailedRes("Wrong Payload");
  }

  const extensions = tryit(() => payload.Extensions, {});
  if (
    !extensions.root ||
    ["confirmIndicatior", "confirmDate"].find(
      (ext) => !extensions.root[ext] || !lib.isString(extensions.root[ext])
    )
  ) {
    isValid = false;
    return getFailedRes("Wrong extensions");
  }

  draft.json.isValid = isValid;
  draft.json.reqBody = body;
  draft.json.payload = payload;
  draft.response.body = {};
};
