module.exports.saveConfig = async (body, { dynamodb, tableName, zip }) => {
  const { id, config } = body;
  const data = { ...body, config: zip(JSON.stringify(config)) };

  const result = await dynamodb.insertItem(
    tableName,
    { pkid: "config", skid: id },
    data,
    { useCustomerRole: false }
  );
  return result;
};

module.exports.getAllConfigs = async ({ dynamodb, tableName, unzip }) => {
  let result = await dynamodb.query(
    tableName,
    { pkid: "config" },
    {},
    { useCustomerRole: false }
  );

  if (result.length > 0) {
    result = result.map((item) => {
      return { ...item, config: JSON.parse(unzip(item.config)) };
    });
  }

  return result;
};
