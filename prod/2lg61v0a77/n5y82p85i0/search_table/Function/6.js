module.exports = async (draft, { env }) => {
  draft.json.connection = JSON.parse(env.SAP_DEV);
};
