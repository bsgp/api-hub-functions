module.exports = async (
  draft,
  { request, dynamodb, zip, unzip, makeid, isFalsy, fn }
) => {
  const { id, description, title, paths, path: uriPath } = request.body;
  const tableName = ["lc_ui5", request.stage].join("_");
  const binaryAttributes = [
    "forms",
    "functions",
    "tables",
    "headers",
    "dialogs",
  ];

  switch (request.method) {
    case "POST":
      {
        if (request.body.tables) {
          request.body.tables.forEach((table) => {
            if (!table.key) {
              throw new Error("Table Key must not be empty");
            }
          });
        }

        const data = {
          description,
          title,
          paths,
          ...binaryAttributes.reduce((acc, key) => {
            if (request.body[key] !== undefined) {
              acc[key] = zip(JSON.stringify(request.body[key]));
            }
            return acc;
          }, {}),
        };
        if (isFalsy(data.paths)) {
          delete data.paths;
        }

        const filteredPaths = data.paths && paths.filter((path) => path.value);

        if (filteredPaths.length > 0) {
          data.paths = filteredPaths.map((path) => path.value);
        } else {
          delete data.paths;
        }

        let resId;
        if (id) {
          resId = id;

          const metaOperations = {};
          const metaSets = {};
          if (data.paths) {
            metaOperations.paths = "ADD";
            metaSets.paths = "string";
          }

          await dynamodb.updateItem(
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

          await dynamodb.insertItem(
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

        draft.response.body = {
          id: resId,
        };
      }
      break;
    case "GET":
      {
        if (id === "*") {
          // const results = await dynamodb.query(
          //   tableName,
          //   { pkid: "path" },
          //   {},
          //   { useCustomerRole: false }
          // );

          const results = await dynamodb.query(
            tableName,
            { pkid: "meta" },
            {},
            { useCustomerRole: false }
          );

          draft.response.body = {
            count: results.length,
            list: results.map((result) => ({
              ...result,
              ...binaryAttributes.reduce((acc, key) => {
                acc[key] = undefined;
                return acc;
              }, {}),
            })),
          };
        } else if (id) {
          const result = await fn.getMetaById(id, {
            dynamodb,
            tableName,
            binaryAttributes,
            unzip,
          });
          draft.response.body = result;
        } else if (uriPath) {
          const result = await fn.getMetaByPath(uriPath, {
            dynamodb,
            tableName,
            paths,
            binaryAttributes,
            unzip,
          });
          draft.response.body = result;
        } else {
          throw new Error("Invalid GET Request");
        }
      }
      break;
    default:
      break;
  }
};
