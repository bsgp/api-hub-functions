module.exports = async (draft, { sql }) => {
  const dbConfig = {
    url: "10.100.10.158",
    port: "1521",
    user: "people",
    password: "people$",
    database: "GHRPB",
    fetchDefaultValue: true,
  };

  const builder = sql("oracle", dbConfig);

  draft.ref.builder = builder;
};
