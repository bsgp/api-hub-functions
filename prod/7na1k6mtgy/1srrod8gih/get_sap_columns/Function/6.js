module.exports = async (draft) => {
  const fieldsNoText = draft.json.resBody.list.filter(({ text }) => !text);
  if (fieldsNoText.length === 0) {
    draft.json.nextNodeKey = "Function#10";
    return;
  }
  draft.json.nextNodeKey = "Flow#7";

  draft.json.parameters.QUERY_TABLE = "DD03T";
  draft.json.parameters.FIELDS = [
    "TABNAME",
    "FIELDNAME",
    "DDLANGUAGE",
    "DDTEXT",
  ];
  // draft.json.parameters.OPTIONS = [draft.json.parameters.OPTIONS[0]];
};
