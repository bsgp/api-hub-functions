module.exports = async (draft, { env, request }) => {
  if (draft.json.connection === undefined) {
    const alias = env.CURRENT_ALIAS || request.stage;
    // draft.response.body = alias;
    // draft.json.terminateFlow = true;
    // return;
    draft.json.connection = JSON.parse(env[`SAP_${alias.toUpperCase()}`]);
  }

  draft.json.detail = {
    params: {
      USERNAME: "9000",
    },
  };
};
