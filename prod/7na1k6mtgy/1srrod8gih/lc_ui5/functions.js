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

module.exports.saveMeta = async (
  body,
  { dynamodb, tableName, binaryAttributes, zip, isFalsy, makeid }
) => {
  const { id, description, title, paths } = body;

  const data = {
    description,
    title,
    paths,
    ...binaryAttributes.reduce((acc, key) => {
      if (body[key] !== undefined) {
        acc[key] = zip(JSON.stringify(body[key]));
      }
      return acc;
    }, {}),
  };
  if (isFalsy(data.paths)) {
    delete data.paths;
  }

  const filteredPaths = data.paths ? paths.filter((path) => path.value) : [];

  if (filteredPaths.length > 0) {
    data.paths = filteredPaths.map((path) => path.value);
  } else {
    delete data.paths;
  }

  let resId;
  let result;
  if (id) {
    resId = id;

    const metaOperations = {};
    const metaSets = {};
    if (data.paths) {
      metaOperations.paths = "ADD";
      metaSets.paths = "string";
    }

    result = await dynamodb.updateItem(
      tableName,
      { pkid: "meta", skid: id },
      { ...data, id: resId },
      {
        operations: metaOperations,
        sets: metaSets,
        conditions: {
          skid: {
            operation: "=",
            value: id,
          },
        },
        useCustomerRole: false,
      }
    );
  } else {
    resId = makeid(10);

    const metaSets = {};
    if (data.paths) {
      metaSets.paths = "string";
    }

    result = await dynamodb.insertItem(
      tableName,
      { pkid: "meta", skid: resId },
      { ...data, id: resId },
      {
        sets: metaSets,
        useCustomerRole: false,
      }
    );
  }

  if (filteredPaths.length > 0) {
    await dynamodb.transaction(
      filteredPaths.map((path) => ({
        tableName,
        type: "Update",
        keys: { pkid: "path", skid: path.value },
        values: {
          value: path.value,
          title: path.title,
          metaId: resId,
        },
      })),
      { useCustomerRole: false }
    );
  }

  return result;
};

module.exports.getAllMeta = async ({ dynamodb, tableName }) => {
  const results = await dynamodb.query(
    tableName,
    { pkid: "meta" },
    {},
    { useCustomerRole: false }
  );

  return results;
};
