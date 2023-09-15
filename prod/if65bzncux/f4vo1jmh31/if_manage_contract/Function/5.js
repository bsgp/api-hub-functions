module.exports = async (draft) => {
  draft.response.body = {
    request_contractID: draft.json.newData.contractID,
    tables: draft.json.tables,
    contract: {
      contractID: "7546",
      type: "P",
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
    },
    E_STATUS: "S",
    E_MESSAGE: "TEST",
  };
};
