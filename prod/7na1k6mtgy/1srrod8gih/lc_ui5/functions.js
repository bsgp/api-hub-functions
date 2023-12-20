const binaryAttributes = [
  "forms",
  "functions",
  "tables",
  "headers",
  "dialogs",
  "codeeditors",
];

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
      // paths = paths.map((path) => ({ ...path, oldPath: path.value }));
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

module.exports.getMetaByPath = async (path, { dynamodb, tableName, unzip }) => {
  const resultPath = await dynamodb.getItem(
    tableName,
    { pkid: "path", skid: path },
    { useCustomerRole: false }
  );

  let dynamicPath = {};

  if (!resultPath) {
    const parts = path.replace("/", "").split("/");
    const prefixPath = parts.shift() + "/";
    const routes = await dynamodb.query(
      tableName,
      { pkid: "pattern" },
      { skid: ["begins_with", "/" + prefixPath] },
      {
        filters: {
          length: { operation: "=", value: parts.length + 1 },
        },
        useCustomerRole: false,
      }
    );

    const matchRoutes = [];
    parts.forEach((part, index) => {
      const objMatchRoute = routes.find((route) => {
        const pattern = route.skid.replace(`/${prefixPath}`, "").split("/")[
          index
        ];
        return part === pattern;
      });

      if (objMatchRoute) {
        matchRoutes.push([objMatchRoute.lOcKkEy]);
        return;
      }

      const arrMatchRoute = routes
        .filter((route) => {
          const pattern = route.skid.replace(`/${prefixPath}`, "").split("/")[
            index
          ];
          return pattern.startsWith(":");
        })
        .map((el) => el.lOcKkEy);

      if (arrMatchRoute.length > 0) {
        matchRoutes.push(arrMatchRoute);
      }
    });

    if (matchRoutes.length === parts.length) {
      const baseLine = matchRoutes.shift();
      const allMatchRoute = baseLine.find((base) => {
        const matchResult = matchRoutes.map((matchRoute) => {
          return matchRoute.includes(base);
        });

        const findMissMatch = matchResult.findIndex((pass) => pass === false);
        return findMissMatch === -1;
      });

      if (allMatchRoute) {
        dynamicPath = routes.find((route) => route.lOcKkEy === allMatchRoute);
      } else {
        throw new Error("NOT Found Path");
      }
    } else {
      throw new Error("NOT Found Path");
    }
  }

  const metaId = resultPath ? resultPath.metaId : dynamicPath.metaId;

  const result = await getMetaById(metaId, {
    dynamodb,
    tableName,
    binaryAttributes,
    unzip,
    includePaths: false,
  });

  return { ...result, dynamicPath };
};

const saveMeta = async (
  body,
  { dynamodb, tableName, zip, isFalsy, makeid }
) => {
  const { id, description, wrapForms, title } = body;

  const data = {
    description,
    title,
    wrapForms,
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
        // conditions: {
        //   skid: {
        //     operation: "=",
        //     value: id,
        //   },
        // },
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
module.exports.saveMeta = saveMeta;

module.exports.getAllMeta = async ({ dynamodb, tableName }) => {
  const results = await dynamodb.query(
    tableName,
    { pkid: "meta" },
    {},
    { useCustomerRole: false }
  );

  return results;
};

const doUpdatePath = async (data, { dynamodb, tableName, isFalsy }) => {
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
    const pathRegExp = /(?<=:)[\w-]+/g;
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

        let oldParamsIndex = 0;
        const oldDynamicPath = oldPath.replace(
          pathRegExp,
          () => `${oldParamsIndex++}`
        );
        try {
          await dynamodb.deleteItem(
            tableName,
            { pkid: "pattern", skid: oldDynamicPath },
            { useCustomerRole: false }
          );
        } catch {
          //pass
        }
      } else {
        throw new Error(["Old path", oldPath, "does not exist"].join(" "));
      }
    }

    const newDataPath = {
      ...dataOldPath,
      metaId: id,
      value: path,
      ...optionalData,
    };

    const result = await dynamodb.insertItem(
      tableName,
      { pkid: "path", skid: path },
      newDataPath,
      {
        useCustomerRole: false,
      }
    );

    const params = path.match(pathRegExp);
    let paramsIndex = 0;
    const dynamicPath = path.replace(pathRegExp, () => `${paramsIndex++}`);

    const newPattern = {
      metaId: id,
      params: params || [],
      length: path.split("/").length - 1,
    };

    await dynamodb.insertItem(
      tableName,
      { pkid: "pattern", skid: dynamicPath },
      newPattern,
      {
        useCustomerRole: false,
      }
    );

    await dynamodb.updateItem(
      tableName,
      { pkid: "meta", skid: id },
      { paths: [path] },
      {
        operations: {
          paths: "+",
        },
        sets: {
          paths: "string",
        },
        useCustomerRole: false,
      }
    );
    if (dataOldPath) {
      await dynamodb.updateItem(
        tableName,
        { pkid: "meta", skid: id },
        { paths: [oldPath] },
        {
          operations: {
            paths: "-",
          },
          sets: {
            paths: "string",
          },
          useCustomerRole: false,
        }
      );
    }
    return result;
  }
};
module.exports.doUpdatePath = doUpdatePath;

module.exports.doCopyMetaToDev = async (
  copyMetaToDev,
  { dynamodb, tableName, devTableName, unzip, zip, isFalsy, makeid }
) => {
  const { id } = copyMetaToDev;
  const metaData = await getMetaById(id, { dynamodb, tableName, unzip });

  await saveMeta(metaData, {
    dynamodb,
    tableName: devTableName,
    zip,
    isFalsy,
    makeid,
  });

  if (isFalsy(metaData.paths)) {
    // pass
  } else {
    for (let idx = 0; idx < metaData.paths.length; idx += 1) {
      const path = metaData.paths[idx];

      await doUpdatePath(
        { id: path.metaId, path: path.value, ...path },
        { dynamodb, tableName: devTableName, isFalsy }
      );
    }
  }

  return {
    message: "복사 완료",
  };
};
