module.exports = async (draft) => {
  const keys = Object.keys(draft.response.body);
  const newBody = {};
  keys
    .filter((key) => draft.response.body[key] === "Succeed")
    .forEach((key) => {
      newBody[key] = draft.response.body[key];
    });

  keys
    .filter((key) => draft.response.body[key] !== "Succeed")
    .forEach((key) => {
      newBody[key] = draft.response.body[key];
    });

  draft.response.body = newBody;
};
