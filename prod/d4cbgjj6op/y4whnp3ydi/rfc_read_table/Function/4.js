module.exports = async (draft, { env }) => {
  draft.pipe.json.connection = JSON.parse(env.SAP_DEV);
};
