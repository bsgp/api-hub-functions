module.exports = async (draft, { request, env }) => {
  if (draft.json.connection === undefined) {
    draft.json.connection = JSON.parse(
      env[`SAP_${request.stage.toUpperCase()}`]
    );
  }

  if (draft.json.parameters === undefined) {
    draft.json.parameters = request.body.Parameters;
  }
};
