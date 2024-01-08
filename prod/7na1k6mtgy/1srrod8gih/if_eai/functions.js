module.exports.saveConfig = async (body, { dynamodb, tableName, zip }) => {
  const { id, config } = body;
  const data = { ...body, config: zip(JSON.strigify(config)) };

  const result = await dynamodb.insertItem(
    tableName,
    { pkid: "config", skid: id },
    data,
    { useCustomerRole: false }
  );
  return result;
};
