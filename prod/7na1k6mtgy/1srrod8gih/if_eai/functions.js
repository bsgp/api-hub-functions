module.exports.saveConfig = async (
  body,
  { dynamodb, tableName, zip, method }
) => {
  const { id, config } = body;
  const data = { ...body, config: zip(JSON.stringify(config)) };

  const result = await dynamodb.insertItem(
    tableName,
    { pkid: "config", skid: id },
    data,
    { useCustomerRole: false, asInsert: method === "POST" }
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

module.exports.getConfig = async (id, { dynamodb, tableName, unzip }) => {
  const result = await dynamodb.getItem(
    tableName,
    { pkid: "config", skid: id },
    { useCustomerRole: false }
  );

  if (result) {
    result.config = JSON.parse(unzip(result.config));
  }
  return result;
};
