module.exports = async (draft, { lib }) => {
  const { tryit } = lib;

  draft.json.athenaTableName = draft.json.rfcName.toLowerCase();
  draft.json.output = {
    list: [],
  };
  switch (draft.json.ifId) {
    case "IF-SD-020":
    case "IF-CO-007":
    case "IF-MM-011":
    case "IF-PP-002":
    case "IF-FI-007":
      // draft.json.fileKey = "WERKS"

      if (
        tryit(() => draft.json.rfc.response.body.result.ET_DATA.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.ET_DATA;
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    case "IF-CO-008":
      if (
        tryit(() => draft.json.rfc.response.body.result.ET_MAIN.length, 0) > 0
      ) {
        draft.json.output.list = draft.json.rfc.response.body.result.ET_MAIN;
      } else {
        draft.response.body = {
          rfcResult: draft.json.rfc.response,
        };
      }
      break;
    default:
      break;
  }
};
