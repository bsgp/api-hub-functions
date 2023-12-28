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

  if (result === undefined) {
    const newError = new Error("No metadata found");
    newError.errorCode = "NO_META";
    throw newError;
  }

  if (includePaths === true) {
    result.paths = await dynamodb.query(
      tableName,
      { pkid: "path" },
      { metaId: id },
      {
        indexName: "pkid-metaId-index",
        useCustomerRole: false,
      }
    );
  } else {
    delete result.paths;
  }

  return {
    ...result,
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
  const resultPaths = await dynamodb.query(
    tableName,
    { pkid: "path" },
    { origin: path },
    { indexName: "pkid-origin-index", useCustomerRole: false }
  );

  if (resultPaths.length > 1) {
    throw new Error(
      [
        resultPaths.map((each) => `Meta ${each.metaId}`).join(", "),
        "들에 같은 Path가 지정되어 있습니다",
      ].join(" ")
    );
  }

  const foundExactMatchedPath = resultPaths.length === 1;

  let targetPath;

  if (foundExactMatchedPath === true) {
    targetPath = resultPaths[0];
  } else {
    const parts = path.split("/").filter(Boolean);

    if (parts.length <= 1) {
      throw new Error("지원하지 않는 URL Path입니다");
    }

    const prefixPath = "/" + parts[0] + "/";
    let routes = await dynamodb.query(
      tableName,
      { pkid: "path" },
      { origin: ["begins_with", prefixPath] },
      {
        indexName: "pkid-origin-index",
        filters: {
          length: { operation: "=", value: parts.length },
        },
        useCustomerRole: false,
      }
    );

    // ["ccs", "viewer", "P202300020"] = parts
    parts.forEach((part, index) => {
      if (index === 0 || routes.length === 0) {
        return;
      }

      const staticMatchRoute = routes.find((route) => {
        const pattern = route.origin.split("/").filter(Boolean)[index];

        // 우선 변수가 아닌 static 값으로 비교
        if (pattern.startsWith(":")) {
          return false;
        }
        return part === pattern;
      });

      if (staticMatchRoute) {
        routes = [staticMatchRoute];
        return;
      }

      const varMatchRoute = routes.find((route) => {
        const pattern = route.origin.split("/").filter(Boolean)[index];

        // static 값으로 매칭되는 route가 없을때 변수를 확인함
        if (pattern.startsWith(":")) {
          return true;
        }
        return false;
      });

      if (varMatchRoute) {
        routes = [varMatchRoute];
      } else {
        routes = [];
      }
    });

    if (routes.length === 0) {
      throw new Error(`Not found meta by path ${path}`);
    }
    targetPath = routes[0];
  }

  const metaId = targetPath.metaId;

  const result = await getMetaById(metaId, {
    dynamodb,
    tableName,
    binaryAttributes,
    unzip,
    includePaths: false,
  });

  return { ...result, paths: [targetPath] };
};

const saveMeta = async (body, { dynamodb, tableName, zip, makeid }) => {
  const { id, description, wrapForms, title } = body;

  const data = {
    description,
    title,
    wrapForms,
    // paths: [],
    ...binaryAttributes.reduce((acc, key) => {
      if (body[key] !== undefined) {
        acc[key] = zip(JSON.stringify(body[key]));
      }
      return acc;
    }, {}),
  };

  let resId;
  let result;
  if (id) {
    resId = id;

    const metaOperations = {};
    const metaSets = {};

    result = await dynamodb.updateItem(
      tableName,
      { pkid: "meta", skid: id },
      { ...data, id: resId },
      {
        operations: metaOperations,
        sets: metaSets,
        useCustomerRole: false,
      }
    );
  } else {
    resId = makeid(10);

    const metaSets = {};

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
  const pathLength = path.split("/").filter(Boolean).length;
  optionalData.length = pathLength;

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
    // numbered: { operation: "=", value: convertPath },
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
      indexName: "pkid-numbered-index",
      useCustomerRole: false,
    }
  );

  if (itemsByNumbered.length === 0) {
    if (isUpdate) {
      const result = await dynamodb.updateItem(
        tableName,
        { pkid: "path", skid: id },
        {
          ...optionalData,
          origin: path,
          params,
          numbered: convertPath,
        },
        {
          useCustomerRole: false,
        }
      );
      return result;
    } else {
      const result = await dynamodb.insertItem(
        tableName,
        { pkid: "path", skid: makeid(7) },
        {
          ...optionalData,
          origin: path,
          params,
          numbered: convertPath,
        },
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
          sameItem.skid,
          "Path",
          sameItem.origin,
          "과 같은 라우팅 패턴이기때문에 변경 불가합니다",
        ].join(" ")
      );
    } else {
      throw new Error(
        [
          "ID",
          sameItem.skid,
          "Path",
          sameItem.origin,
          "과 같은 라우팅 패턴이기때문에 등록 불가합니다",
        ].join(" ")
      );
    }
  }
};
module.exports.doUpdatePath = doUpdatePath;

module.exports.doCopyMetaToDev = async (
  copyMetaToDev,
  { dynamodb, tableName, devTableName, unzip, zip, makeid }
) => {
  const { id } = copyMetaToDev;
  const metaData = await getMetaById(id, { dynamodb, tableName, unzip });

  await saveMeta(metaData, {
    dynamodb,
    tableName: devTableName,
    zip,
    makeid,
  });

  return {
    message: "복사 완료",
  };
};
