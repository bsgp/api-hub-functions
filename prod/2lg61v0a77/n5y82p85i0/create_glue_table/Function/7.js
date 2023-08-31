module.exports = async (draft, { request, glue }) => {
  const result2 = await glue.db.get(
    ["ecc_dev_datalake", request.stage].join("_"),
    {
      useCustomerRole: true,
    }
  );
  draft.response.body = result2;
};
