module.exports = async (draft) => {
  if (draft.json.body.errorMessage) {
    draft.response.body = {
      ...draft.json.body,
    };
    draft.response.body.count = 0;
    draft.response.body.list = [];
  } else {
    const keys = Object.keys(draft.json.body);

    draft.response.body = {
      count: keys.length,
      list: keys.map((key) => draft.json.body[key]),
    };
  }
};
