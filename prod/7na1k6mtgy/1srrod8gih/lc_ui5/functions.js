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
      { pkid: "path" },
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

function extractObjByKey(keys, obj) {
  return ["title"].reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

function numberingPath(origin) {
  const paramRegExp = /(?<=:)[\w]+/g;

  let paramsIndex = 0;
  const newPath = origin.replace(paramRegExp, () => `${paramsIndex++}`);

  const params = origin.match(paramRegExp);

  return [newPath, params];
}

const doUpdatePath = async (data, { dynamodb, tableName, makeid }) => {
  const { id, metaId, path } = data;

  const optionalData = extractObjByKey(["title", "metaId"], data);

  if (!metaId) {
    throw new Error("metaId is required");
  }

  if (!path) {
    throw new Error("path is required");
  }

  const pathRegExp = /^\/([\w]{1,})((\/:|\/)[\w]{1,}){1,}$/;
  if (!pathRegExp.test(path)) {
    throw new Error("A path that violates the path generation rules");
  }

  const [convertPath, params] = numberingPath(path);

  const isUpdate = !!id;

  if (isUpdate) {
    const itemById = await dynamodb.getItem(
      tableName,
      { pkid: "path", skid: id },
      { useCustomerRole: false }
    );

    if (!itemById) {
      throw new Error(`Not found id ${id}`);
    }

    if (itemById.origin === path) {
      const result = await dynamodb.updateItem(
        tableName,
        { pkid: "path", skid: id },
        optionalData,
        {
          useCustomerRole: false,
        }
      );
      return result;
    }

    if (itemById.numbered === convertPath) {
      const result = await dynamodb.updateItem(
        tableName,
        { pkid: "path", skid: id },
        { ...optionalData, origin: path, params },
        {
          useCustomerRole: false,
        }
      );
      return result;
    }
  }

  const filtersForDup = {
    numbered: { operation: "=", value: convertPath },
  };

  if (isUpdate) {
    filtersForDup.skid = { operation: "<>", value: id };
  }

  const itemsByNumbered = await dynamodb.query(
    tableName,
    { pkid: "path" },
    { numbered: convertPath },
    {
      filters: filtersForDup,
      indexName: "pkid_numbered_index",
      useCustomerRole: false,
    }
  );

  if (itemsByNumbered.length === 0) {
    if (isUpdate) {
      const result = await dynamodb.updateItem(
        tableName,
        { pkid: "path", skid: id },
        { ...optionalData, origin: path, params },
        {
          useCustomerRole: false,
        }
      );
      return result;
    } else {
      const result = await dynamodb.insertItem(
        tableName,
        { pkid: "path", skid: makeid(7) },
        { ...optionalData, origin: path, params },
        {
          useCustomerRole: false,
        }
      );
      return result;
    }
  } else {
    const sameItem = itemsByNumbered[0];
    if (isUpdate) {
      throw new Error(
        [
          "ID",
          sameItem.id,
          "Path",
          sameItem.origin,
          "과 같은 라우팅 패턴이기때문에 변경 불가합니다",
        ].join(" ")
      );
    } else {
      throw new Error(
        [
          "ID",
          sameItem.id,
          "Path",
          sameItem.origin,
          "과 같은 라우팅 패턴이기때문에 등록 불가합니다",
        ].join(" ")
      );
    }
  }

  // if (dataOldPath) {
  //   await dynamodb.updateItem(
  //     tableName,
  //     { pkid: "meta", skid: id },
  //     { paths: [convertOldPath] },
  //     {
  //       operations: {
  //         paths: "-",
  //       },
  //       sets: {
  //         paths: "string",
  //       },
  //       useCustomerRole: false,
  //     }
  //   );
  // }

  // await dynamodb.updateItem(
  //   tableName,
  //   { pkid: "meta", skid: id },
  //   { paths: [convertPath] },
  //   {
  //     operations: {
  //       paths: "+",
  //     },
  //     sets: {
  //       paths: "string",
  //     },
  //     useCustomerRole: false,
  //   }
  // );

  // return result;
  // }
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
