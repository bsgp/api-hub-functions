module.exports = async (draft) => {
  draft.response.body = {
    request_contractID: draft.json.newData.contractID,
    contract: {
      type: "P",
      contractID: "7775577",
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
    },
    E_STATUS: "S",
    E_MESSAGE: "TEST",
  };
};
