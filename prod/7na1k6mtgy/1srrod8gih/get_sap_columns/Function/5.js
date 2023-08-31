// function convToBoolean(value) {
//   return value === "X";
// }

module.exports = async (draft, { request }) => {
  // query all languages
  // English(E) is 1st priority, Korean(3) is next,

  const { result, errorMessage } = draft.response.body;

  if (errorMessage) {
    draft.json.terminateFlow = true;
    return;
  }

  const selectedLang = request.body.Lang || "E";

  result.DATA.forEach((each) => {
    const originObject = draft.json.resBody.list.find(
      ({ tableName, fieldName }) =>
        tableName === each.TABNAME && fieldName === each.FIELDNAME
    );
    if (originObject) {
      if (each.DDLANGUAGE === selectedLang) {
        originObject.spras = each.DDLANGUAGE;
        originObject.text = each.SCRTEXT_S || each.DDTEXT || originObject.text;
      } else {
        if (originObject.spras !== selectedLang) {
          originObject.spras = each.DDLANGUAGE;
          originObject.text =
            each.SCRTEXT_S || each.DDTEXT || originObject.text;
        }
      }
    }
  });
};
