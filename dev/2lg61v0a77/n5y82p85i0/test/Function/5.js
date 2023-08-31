module.exports = async (draft, { request, loop }) => {
  draft.json.parameters = {
    QUERY_TABLE: request.body.TableName,
    DELIMITER: ",",
    NO_DATA: "X",
  };

  draft.json.loop.push(`parameters:${loop.index}`);
};
