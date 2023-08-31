module.exports = async (draft, { request, env }) => {
  if (draft.json.connection === undefined) {
    const envSuffix = env.CURRENT_ALIAS || request.stage;
    draft.json.connection = JSON.parse(
      env[["SAP", envSuffix.toUpperCase()].join("_")]
    );

    // draft.json.connection = JSON.parse(
    //   env[`SAP_${request.stage.toUpperCase()}`]
    // );
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
