module.exports = async (draft, { request, env }) => {
  if (draft.json.connection === undefined) {
    draft.json.connection = JSON.parse(
      env[`SAP_${request.stage.toUpperCase()}`]
    );
  }

  draft.json.parameters = {};
};
