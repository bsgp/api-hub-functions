// function convToBoolean(value) {
//   return value === "X";
// }

module.exports = async (draft) => {
  const { result, errorMessage } = draft.response.body;

  if (draft.json.body === undefined) {
    draft.json.body = {};
  }

  if (errorMessage) {
    draft.json.body = {
      errorMessage,
    };
    return;
  }

  if (draft.json.body.errorMessage) {
    return;
  }

  result.DATA.forEach((each) => {
    const key = draft.json.keyFields
      .map((col) => each[col.fieldName])
      .join(",");

    if (draft.json.body[key] === undefined) {
      draft.json.body[key] = { ...each };
    } else {
      result.FIELDS.forEach((field) => {
        draft.json.body[key][field.FIELDNAME] = each[field.FIELDNAME];
      });
    }
  });
};
