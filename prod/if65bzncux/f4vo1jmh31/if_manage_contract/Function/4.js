module.exports = async (draft, { lib, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);
  switch (request.body.InterfaceId) {
    case "IF-CT-101":
      draft.response.body = {
        request_contractID: draft.json.newData.contractID,
        contract: {
          type: "P",
          partyList: [],
          costObjectList: [],
          billList: [],
          attachmentList: [],
        },
        E_STATUS: "S",
        E_MESSAGE: "TEST",
      };
      break;
    default:
      //
      break;
  }
};
