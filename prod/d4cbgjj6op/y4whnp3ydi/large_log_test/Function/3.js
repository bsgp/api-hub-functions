module.exports = async (draft) => {
  draft.response.body = Array.from(Array(100000 * 100).keys())
    .map(() => "a")
    .join("");
};
