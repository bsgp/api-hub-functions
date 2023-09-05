module.exports = async (
  draft
  // { request }
) => {
  // 	draft.json.username = env.BYD_ID;
  // draft.json.password = env.BYD_PASSWORD;
  const url = [draft.json.rootURL].join("");
  draft.response.body = { ...draft.response.body, url };
};
