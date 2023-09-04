module.exports.getMetaById = async (
  id,
  { dynamodb, tableName, binaryAttributes, unzip }
) => {
  const result = await dynamodb.getItem(
    tableName,
    { pkid: "meta", skid: id },
    { useCustomerRole: false }
  );

  let paths;
  if (result.paths && result.paths.length > 0) {
    paths = await dynamodb.batchGetItem(
      tableName,
      result.paths.map((path) => ({ pkid: "path", skid: path })),
      { useCustomerRole: false }
    );
  }

  if (result === undefined) {
    const newError = new Error("No metadata found");
    newError.errorCode = "NO_META";
    throw newError;
  }

  return {
    ...result,
    id,
    paths,
    ...binaryAttributes.reduce((acc, key) => {
      if (result[key] !== undefined) {
        acc[key] = JSON.parse(unzip(result[key]));
      }

      return acc;
    }, {}),
  };
};
