module.exports = async (draft, { request, file }) => {
  if (!["POST", "TASK"].includes(request.method)) {
    draft.response.body = {
      errorMessage: "HTTP Method must be 'POST'",
    };
    draft.response.statusCode = 400;
    draft.json.terminateFlow = true;
    return;
  }

  const ifList = await file.get("if/list.json", {
    gziped: true,
    toJSON: true,
  });

  const ifObj = ifList[request.body.InterfaceId];

  draft.json.ifId = request.body.InterfaceId;
  draft.json.ifObj = ifObj;
  draft.json.partitionKey = draft.json.ifObj.PartitionKey;
  draft.json.fileKey = draft.json.ifObj.FileKey;

  switch (ifObj.Type) {
    case "RFC":
      draft.json.nextNodeKey = "Function#4";
      draft.json.rfcName = ifObj.Name;
      draft.json.parameters = request.body.Data;
      break;
    case "DB":
      draft.json.nextNodeKey = "Function#6";
      draft.json.dbTableName = ifObj.Name;
      break;
    default:
      draft.response.body = {
        errorMessage: "인터페이스 오브젝트의 타입이 지원되지 않습니다",
      };
      draft.response.statusCode = 400;
      draft.json.terminateFlow = true;
      break;
  }

  // const { tryit } = lib;
  // const { isFalsy } = lib.type;

  // if (isFalsy(ifList)) {
  //   draft.response.body = {
  //     errorMessage: "Can not find interface list",
  //   };
  //   draft.response.statusCode = 500;
  //   return;
  // }

  // if (isFalsy(tryit(() => request.body.InterfaceId))) {
  //   draft.response.body = {
  //     errorMessage: "InterfaceId is required",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // if (isFalsy(tryit(() => request.body.FunctionName))) {
  //   draft.response.body = {
  //     errorMessage: "FunctionName is required",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // const ifItem = tryit(() => ifList[request.body.InterfaceId]);
  // if (isFalsy(ifItem)) {
  //   draft.response.body = {
  //     errorMessage:
  // "Can not find interface item using provided Interface ID",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // const fnFromIf = tryit(() => ifItem.FunctionName);
  // if (isFalsy(fnFromIf)) {
  //   draft.response.body = {
  //     errorMessage: "Can not find function name using provided Interface ID",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // if (fnFromIf !== request.body.FunctionName) {
  //   draft.response.body = {
  //     errorMessage:
  //       "The function name does not matched with pre-defined interface item",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // const { requestTimeArray } = request;

  // const requestTime = requestTimeArray.join("-");

  // if (requestTime < "2021-10-07-15-00") {
  //   if (request.body.InterfaceId.startsWith("IF_PR00")) {
  //     draft.response.body = {
  //       errorMessage: [
  //         "금일(10/7) PRM 회계 임시점검이 지연되는 관계로",
  //         "내일부터 정상적으로 사용 가능할것 같습니다.",
  //         "사용중 불편을 드려 대단히 죄송합니다.",
  //       ].join(" "),
  //     };
  //     draft.response.statusCode = 400;
  //     return;
  //   }
  // }

  // if (isFalsy(tryit(() => request.body.Parameters.I_UIDNT))) {
  //   draft.response.body = {
  //     errorMessage: "I_UIDNT in Parameters is required",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // if (isFalsy(tryit(() => request.body.Parameters.I_UTEXT))) {
  //   draft.response.body = {
  //     errorMessage: "I_UTEXT in Parameters is required",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // if (isFalsy(tryit(() => request.body.Parameters.I_SYSID))) {
  //   draft.response.body = {
  //     errorMessage: "I_SYSID in Parameters is required",
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }
};
