module.exports = async (
  draft,
  { request, dynamodb, zip, unzip, makeid, isFalsy, fn }
) => {
  const tablePrefix = "lc_ui5";
  const tableName = [tablePrefix, request.stage].join("_");
  const devTableName = [tablePrefix, "dev"].join("_");

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
          zip,
          isFalsy,
          makeid,
        });

        const result = await fn.getMetaById(saveResult.id, {
          dynamodb,
          tableName,
          unzip,
        });

        draft.response.body = result;
      }
      break;
    case "GET":
      {
        const { id, paths, path: uriPath } = request.body;
        if (id === "*") {
          const results = await fn.getAllMeta({ dynamodb, tableName });

          draft.response.body = {
            count: results.length,
            list: results,
          };
        } else if (id) {
          const result = await fn.getMetaById(id, {
            dynamodb,
            tableName,
            unzip,
          });
          draft.response.body = result;
        } else if (uriPath) {
          const result = await fn.getMetaByPath(uriPath, {
            dynamodb,
            tableName,
            paths,
            unzip,
          });
          draft.response.body = result;
        } else {
          throw new Error("Invalid GET Request");
        }
      }
      break;
    case "PUT":
      {
        const { copyMetaToDev, updatePath } = request.body;
        if (copyMetaToDev) {
          const result = await fn.doCopyMetaToDev(copyMetaToDev, {
            dynamodb,
            tableName,
            devTableName,
            unzip,
            zip,
            isFalsy,
            makeid,
          });
          draft.response.body = result;
        } else if (updatePath) {
          const result = await fn.doUpdatePath(updatePath, {
            dynamodb,
            tableName,
            isFalsy,
          });
          draft.response.body = result;
        }
      }
      break;
    default:
      break;
  }
};
