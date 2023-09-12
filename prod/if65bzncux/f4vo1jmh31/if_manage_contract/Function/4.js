module.exports = async (draft, { lib, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);
  switch (request.body.InterfaceId) {
    case "IF-CT-101":
      draft.response.body = {
        ...draft.json.newData,
      };
      break;
    default:
      //
      break;
  }
};
