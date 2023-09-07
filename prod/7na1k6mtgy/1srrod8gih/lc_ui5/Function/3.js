module.exports = async (
  draft,
  { request, dynamodb, zip, unzip, makeid, isFalsy, fn }
) => {
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

        const saveResult = await fn.saveMeta(request.body, {
          dynamodb,
          tableName,
          binaryAttributes,
          zip,
          isFalsy,
          makeid,
        });

        const result = await fn.getMetaById(saveResult.id, {
          dynamodb,
          tableName,
          binaryAttributes,
          unzip,
        });

        draft.response.body = result;
      }
      break;
    case "GET":
      {
        const { id, paths, path: uriPath } = request.body;
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
            list: results,
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
