module.exports = async (draft, { env, loop }) => {
  draft.json.connection = JSON.parse(env.SAP_DEV);
  if (draft.json.loop === undefined) {
    draft.json.loop = [];
  }
  draft.json.loop.push(`connection:${loop.index}`);
};
