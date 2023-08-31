module.exports = async (draft, { request }) => {
  if (request.body.DatasetName) {
    draft.json.nextNodeKey = "Flow#5";
  } else if (request.body.TableName) {
    draft.json.nextNodeKey = "Flow#3";
  }
};
