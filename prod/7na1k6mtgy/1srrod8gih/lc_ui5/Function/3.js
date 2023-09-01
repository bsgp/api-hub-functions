module.exports = async (draft, { request, dynamodb, zip, unzip, makeid }) => {
  const { id, description, title, paths } = request.body;
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

        // await dynamodb.updateItem(
        //   tableName,
        //   { pkid: "path", skid: uriPath },
        //   {
        //     path: uriPath,
        //     description,
        //     title,
        //     ...binaryAttributes.reduce((acc, key) => {
        //       if (request.body[key] !== undefined) {
        //         acc[key] = zip(JSON.stringify(request.body[key]));
        //       }
        //       return acc;
        //     }, {}),
        //   },
        //   { useCustomerRole: false }
        // );

        const data = {
          description,
          title,
          paths: paths || [],
          ...binaryAttributes.reduce((acc, key) => {
            if (request.body[key] !== undefined) {
              acc[key] = zip(JSON.stringify(request.body[key]));
            }
            return acc;
          }, {}),
        };

        let resId;
        if (id) {
          resId = id;
          await dynamodb.updateItem(
            tableName,
            { pkid: "meta", skid: id },
            data,
            {
              operations: {
                paths: "ADD",
              },
              sets: { paths: "string" },
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
          await dynamodb.insertItem(
            tableName,
            { pkid: "meta", skid: resId },
            data,
            {
              sets: { paths: "string" },
              useCustomerRole: false,
            }
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
          // } else if (!uriPath) {
          //   throw new Error("Path must not be empty");
        } else {
          // const result = await dynamodb.getItem(
          //   tableName,
          //   { pkid: "path", skid: uriPath },
          //   { useCustomerRole: false }
          // );

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

          draft.response.body = {
            ...result,
            id,
            ...binaryAttributes.reduce((acc, key) => {
              if (result[key] !== undefined) {
                acc[key] = JSON.parse(unzip(result[key]));
              }

              return acc;
            }, {}),
          };
        }
      }
      break;
    default:
      break;
  }
};
