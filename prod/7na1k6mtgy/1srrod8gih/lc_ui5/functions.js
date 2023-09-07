const binaryAttributes = ["forms", "functions", "tables", "headers", "dialogs"];

const getMetaById = async (
  id,
  { dynamodb, tableName, unzip, includePaths = true }
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
  { dynamodb, tableName, paths, unzip }
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
  { dynamodb, tableName, zip, isFalsy, makeid }
) => {
  const { id, description, title } = body;

  const data = {
    description,
    title,
    paths: [],
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

  const filteredPaths = data.paths
    ? data.paths.filter((path) => path.value)
    : [];

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

module.exports.updatePath = async (data, { dynamodb, tableName, isFalsy }) => {
  const { id, path, oldPath } = data;
  const optionalData = ["title"].reduce((acc, key) => {
    if (data[key] !== undefined) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  if (!id) {
    throw new Error("id is required");
  }

  if (!path) {
    throw new Error("path is required");
  }

  // get path from db;
  // if path exists:
  //   if (!path.metaId):
  //     return errorMessage =
  //       {path} exists but not relative with any meta,
  //       remove db record since it is invalid db record;
  //   else:
  //     if(path.metaId === id):
  //       if(oldPath && path !== oldPath):
  //         throw error = {path} already exists in this meta;
  //       else:
  //         update db set title;
  //     else:
  //       return errorMessage =
  //         {path} is relative with meta {metaId}
  // else:
  //   if(oldPath):
  //     get oldPath from db;
  //   insert {...oldPath, metaId: id, path, title}

  const resultPath = await dynamodb.getItem(
    tableName,
    { pkid: "path", skid: path },
    { useCustomerRole: false }
  );

  if (resultPath) {
    if (!resultPath.metaId) {
      throw new Error(
        [
          path,
          "exists but not related to any meta,",
          "remove from db since this is invalid db record",
        ].join(" ")
      );
    } else {
      if (resultPath.metaId === id) {
        if (oldPath && path !== oldPath) {
          throw new Error([path, "already exists in this meta"].join(" "));
        } else {
          if (isFalsy(optionalData)) {
            throw new Error("Nothing to do with payload");
          } else {
            const result = await dynamodb.updateItem(
              tableName,
              { pkid: "path", skid: path },
              optionalData,
              {
                conditions: {
                  metaId: {
                    operation: "=",
                    value: id,
                  },
                },
                useCustomerRole: false,
              }
            );
            return result;
          }
        }
      } else {
        throw new Error(
          [path, "is relative with meta", resultPath.metaId].join(" ")
        );
      }
    }
  } else {
    let dataOldPath;
    if (oldPath) {
      dataOldPath = await dynamodb.getItem(
        tableName,
        { pkid: "path", skid: oldPath },
        { useCustomerRole: false }
      );
      if (dataOldPath) {
        if (dataOldPath.metaId && dataOldPath.metaId !== id) {
          throw new Error(
            [
              "Can not replace",
              oldPath,
              "which exists in other meta",
              dataOldPath.metaId,
              "with",
              path,
            ].join(" ")
          );
        }

        await dynamodb.deleteItem(
          tableName,
          { pkid: "path", skid: oldPath },
          { useCustomerRole: false }
        );
      } else {
        throw new Error(["Old path", oldPath, "does not exist"].join(" "));
      }
    }

    const newDataPath = { ...dataOldPath, metaId: id, path, ...optionalData };

    const result = await dynamodb.insertItem(
      tableName,
      { pkid: "path", skid: path },
      newDataPath,
      {
        useCustomerRole: false,
      }
    );
    return result;
  }
};
