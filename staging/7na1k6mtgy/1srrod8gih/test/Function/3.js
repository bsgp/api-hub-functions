module.exports = async (draft, { env }) => {
  draft.response.body = {
    message: "Hello Global World",
    alias: env.CURRENT_ALIAS,
  };
};
