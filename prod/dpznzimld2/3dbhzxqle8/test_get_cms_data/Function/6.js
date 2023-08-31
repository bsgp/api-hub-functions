module.exports = async (draft, { sql }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { tableName, columns, primaryKeys } = draft.json.alterQuery;

  // columns랑 primaryKeys 모두 비어있는 경우 error 안내
  if (columns.length === 0 && primaryKeys.length === 0) {
    setFailedResponse("Both columns & primary keys are missing");
    return;
  }

  // columns 검증
  const types = [
    "string",
    "integer",
    "biginteger",
    "boolean",
    "date",
    "datetime",
    "decimal",
  ];
  const modes = ["add", "modify", "drop"];
  const checkColumns = columns.every((column) => {
    return (
      column.name && types.includes(column.type) && modes.includes(column.mode)
    );
  });
  if (!checkColumns) {
    setFailedResponse("Check columns and try again");
    return;
  }

  // primaryKeys 체크
  const checkPrimaryKeys = primaryKeys.every((key) => key);
  if (!checkPrimaryKeys) {
    setFailedResponse("Check primary keys and try again");
    return;
  }

  const mysql = sql("mysql");

  const sqlBuilder = mysql.table.alter(tableName, (table) => {
    columns.forEach((column) => {
      switch (column.mode) {
        case "add":
        case "modify": {
          switch (column.type) {
            case "string": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table.string(column.name).notNullable().alter()
                  : table.string(column.name).notNullable();
              } else {
                column.mode === "modify"
                  ? table.string(column.name).alter()
                  : table.string(column.name);
              }
              break;
            }
            case "integer": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table.integer(column.name).notNullable().alter()
                  : table.integer(column.name).notNullable();
              } else {
                column.mode === "modify"
                  ? table.integer(column.name).alter()
                  : table.integer(column.name);
              }
              break;
            }
            case "biginteger": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table.bigInteger(column.name).notNullable().alter()
                  : table.bigInteger(column.name).notNullable();
              } else {
                column.mode === "modify"
                  ? table.bigInteger(column.name).alter()
                  : table.bigInteger(column.name);
              }
              break;
            }
            case "boolean": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table.boolean(column.name).notNullable().alter()
                  : table.boolean(column.name).notNullable();
              } else {
                column.mode === "modify"
                  ? table.boolean(column.name).alter()
                  : table.boolean(column.name);
              }
              break;
            }
            case "date":
            case "datetime": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table
                      .dateTime(column.name, { useTz: true, precision: 6 })
                      .notNullable()
                      .alter()
                  : table
                      .dateTime(column.name, { useTz: true, precision: 6 })
                      .notNullable();
              } else {
                column.mode === "modify"
                  ? table
                      .dateTime(column.name, { useTz: true, precision: 6 })
                      .alter()
                  : table.dateTime(column.name, { useTz: true, precision: 6 });
              }
              break;
            }
            case "decimal": {
              if (column.notNullable && column.notNullable === true) {
                column.mode === "modify"
                  ? table
                      .decimal(
                        column.name,
                        column.precision || 18,
                        column.scale || 3
                      )
                      .notNullable()
                      .alter()
                  : table
                      .decimal(
                        column.name,
                        column.precision || 18,
                        column.scale || 3
                      )
                      .notNullable();
              } else {
                column.mode === "modify"
                  ? table
                      .decimal(
                        column.name,
                        column.precision || 18,
                        column.scale || 3
                      )
                      .alter()
                  : table.decimal(
                      column.name,
                      column.precision || 18,
                      column.scale || 3
                    );
              }
              break;
            }
          }

          if (column.mode === "modify") {
            if (column.renameTo && column.renameTo.trim() !== "") {
              table.renameColumn(column.name, column.renameTo.trim());
            }
          }
          break;
        }
        case "drop": {
          table.dropColumn(column.name);
          break;
        }
      }
    });
    if (primaryKeys.length > 0) {
      table.dropPrimary().primary(primaryKeys);
    }
  });

  draft.response.body = await sqlBuilder.run();
};

/*
tableName: "...",
columns: [
{
  mode: ["add" | "modify" | "drop"]
  name: string
  type: [
    "string" | 
    "integer" | 
    "biginteger" | 
    "boolean" | 
    "date" | 
    "datetime"|
    "decimal"
  ]
  notNullable?: boolean           (mode 값이 "add" | "modify" 둘 중 하나일 때)
  renameTo?: string               (mode 값이 "modify"일 때에만)
  precision?: number  ("add" | "modify" 둘 중 하나이고 type: "decimal" 일 때만)
  scale?: number      ("add" | "modify" 둘 중 하나이고 type: "decimal" 일 때만)
},
  {...},
  ...
],
primaryKeys: ["...", "...", "...", ...]
*/
