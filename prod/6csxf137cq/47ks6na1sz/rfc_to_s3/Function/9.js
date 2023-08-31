module.exports = async (draft, { lib }) => {
  const { tryit } = lib;

  draft.json.athenaTableName = (
    draft.json.ifObj.DatasetName || draft.json.rfcName
  ).toLowerCase();
  draft.json.output = {
    list: [],
  };
  switch (draft.json.ifId) {
    case "IF-MM-002":
    case "IF-MM-003":
      // draft.json.fileKey = "WERKS";

      if (
        tryit(() => draft.json.rfc.response.body.result.PT_DATA.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.PT_DATA;
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    case "IF-PP-001":
    case "IF-PP-002":
    case "IF-PP-003":
    case "IF-CO-001":
      // draft.json.fileKey = "WERKS";

      if (
        tryit(() => draft.json.rfc.response.body.result.T_DATA.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.T_DATA;
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    case "IF-SD-001":
    case "IF-SD-002":
    case "IF-SD-003":
    case "IF-SD-003_2":
      // draft.json.fileKey = "WERKS";

      if (
        tryit(() => draft.json.rfc.response.body.result.IT_TAB.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.IT_TAB;
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    case "IF-SD-004":
    case "IF-SD-005":
    case "IF-SD-005_2":
      // draft.json.fileKey = "WERKS";

      if (
        tryit(() => draft.json.rfc.response.body.result.ET_TAB.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.ET_TAB;
        // .map(
        //   (each) => ({
        //     ...each,
        //     SPMON: draft.json.rfc.response.body.result.I_SPMON,
        //   })
        // );
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    default:
      draft.json.output.list = draft.response.body.list;
      break;
  }
};
