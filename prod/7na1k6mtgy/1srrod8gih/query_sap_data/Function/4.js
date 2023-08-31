module.exports = async (draft, { env }) => {
  const envSuffix = env.CURRENT_ALIAS || "DEV";
  draft.json.connection = JSON.parse(
    env[["SAP", envSuffix.toUpperCase()].join("_")]
  );
};
