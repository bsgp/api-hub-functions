module.exports = async (draft, { request }) => {
  switch (request.body.InterfaceId) {
    case "IF-FI-BZM01":
    case "IF-FI-BZM02":
      draft.json.url = "http://bizmall.qa.golfzon.com/gz/erp/iffibzm.do";
      break;
    case "IF-SD-BZ001":
    case "IF-SD-BZ002":
    case "IF-SD-BZ004":
      draft.json.url = "http://bizmall.qa.golfzon.com/gz/erp/account.do";
      break;
    case "IF-SD-BZ005":
      draft.json.url = "http://bizmall.qa.golfzon.com/gz/erp/account_sp.do";
      break;
    default: {
      //
      break;
    }
  }
};
