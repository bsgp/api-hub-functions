module.exports = async (draft) => {
  // your script
  draft.response.body = {
    ...draft.response.body,
    uuid: draft.pipe.json.newRequest.uuid,
  };
};
