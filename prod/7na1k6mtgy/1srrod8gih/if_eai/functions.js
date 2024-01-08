module.exports.saveConfig = async (data, { dynamodb, tableName }) => {
  const { id } = data;
  const result = await dynamodb.insertItem(
    tableName,
    { pkid: "config", skid: id },
    data,
    { useCustomerRole: false }
  );
  return result;
};
