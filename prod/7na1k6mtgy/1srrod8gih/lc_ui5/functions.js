const getMetaById = async (
  id,
  { dynamodb, tableName, binaryAttributes, unzip, includePaths = true }
) => {
  const result = await dynamodb.getItem(
    tableName,
    { pkid: "meta", skid: id },
    { useCustomerRole: false }
  );

  let paths;
  if (includePaths === true) {
    if (result.paths && result.paths.length > 0) {
      paths = await dynamodb.batchGetItem(
        tableName,
        result.paths.map((path) => ({ pkid: "path", skid: path })),
        { useCustomerRole: false }
      );
    }
  }

  if (result === undefined) {
    const newError = new Error("No metadata found");
    newError.errorCode = "NO_META";
    throw newError;
  }

  return {
    ...result,
    paths,
    ...binaryAttributes.reduce((acc, key) => {
      if (result[key] !== undefined) {
        acc[key] = JSON.parse(unzip(result[key]));
      }

      return acc;
    }, {}),
  };
};
module.exports.getMetaById = getMetaById;

module.exports.getMetaByPath = async (
  path,
  { dynamodb, tableName, paths, binaryAttributes, unzip }
) => {
  const resultPath = await dynamodb.getItem(
    tableName,
    { pkid: "path", skid: path },
    { useCustomerRole: false }
  );

  if (!resultPath) {
    throw new Error("NOT Found Path");
  }

  const result = await getMetaById(resultPath.metaId, {
    dynamodb,
    tableName,
    paths,
    binaryAttributes,
    unzip,
    includePaths: false,
  });

  return result;
};
