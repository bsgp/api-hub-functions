module.exports = async (draft) => {
  draft.response.body = {
    count: draft.pipe.json.resultList.length,
    list: draft.pipe.json.resultList,
  };
};
