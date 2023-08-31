module.exports = async (draft) => {
  draft.json.athenaTableName = (
    draft.json.ifObj.DatasetName || draft.json.dbTableName
  ).toLowerCase();
  draft.json.output = {
    list: [],
  };
  // switch (draft.json.ifId) {
  //   case "IF-WISH-001":
  //   case "IF-EHR-001":
  if (draft.json.dbResult.count > 0) {
    draft.json.output.list = draft.json.dbResult.list;
  } else {
    draft.response.body = {
      dbResult: draft.json.dbResult,
    };
  }
  //     break;
  //   default:
  //     break;
  // }
};
