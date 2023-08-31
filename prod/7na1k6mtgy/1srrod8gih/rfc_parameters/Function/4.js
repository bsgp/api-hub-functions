module.exports = async (draft, { request, env }) => {
  if (draft.json.connection === undefined) {
    const alias = env.CURRENT_ALIAS || request.stage || "DEV";
    draft.json.connection = JSON.parse(env[`SAP_${alias.toUpperCase()}`]);
  }

  if (draft.json.parameters === undefined) {
    draft.json.parameters = request.body.Parameters;
  }

  if (request.body.FunctionName) {
    draft.json.functionName = request.body.FunctionName;
  } else {
    draft.json.functionName = "RFC_READ_TABLE";
  }
};
