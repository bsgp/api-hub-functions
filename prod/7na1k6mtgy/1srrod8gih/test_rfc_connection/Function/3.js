module.exports = async (draft, { request, rfc }) => {
  const { connection } = request.body;

  const result = await rfc.testConnection(connection, { version: "750" });

  draft.response = result;
};
