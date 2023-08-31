module.exports = async (draft, { request, glue }) => {
  const result = await glue.db.create(
    ["ecc_dev_datalake", request.stage].join("_"),
    {
      useCustomerRole: true,
    }
  );

  draft.response.body = result;
};
