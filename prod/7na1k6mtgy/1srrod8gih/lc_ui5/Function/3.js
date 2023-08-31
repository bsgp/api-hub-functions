module.exports = async (draft, { request, dynamodb, zip, unzip }) => {
  const { path: uriPath, description, title } = request.body;
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

        await dynamodb.updateItem(
          tableName,
          { pkid: "path", skid: uriPath },
          {
            path: uriPath,
            description,
            title,
            ...binaryAttributes.reduce((acc, key) => {
              if (request.body[key] !== undefined) {
                acc[key] = zip(JSON.stringify(request.body[key]));
              }
              return acc;
            }, {}),
          },
          { useCustomerRole: false }
        );

        draft.response.body = {
          path: uriPath,
        };
      }
      break;
    case "GET":
      {
        if (uriPath === "*") {
          const results = await dynamodb.query(
            tableName,
            { pkid: "path" },
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
        } else if (!uriPath) {
          throw new Error("Path must not be empty");
        } else {
          const result = await dynamodb.getItem(
            tableName,
            { pkid: "path", skid: uriPath },
            { useCustomerRole: false }
          );
          if (result === undefined) {
            const newError = new Error("No metadata for the requested path");
            newError.errorCode = "NO_META";
            throw newError;
          }

          draft.response.body = {
            ...result,
            path: uriPath,
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
