module.exports = async (draft, { request }) => {
  draft.json.parameters = {
    QUERY_TABLE: request.body.TableName,
    DELIMITER: ",",
    NO_DATA: "X",
  };
};
