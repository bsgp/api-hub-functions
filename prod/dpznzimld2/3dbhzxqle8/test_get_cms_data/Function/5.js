module.exports = async (draft, { sql }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { tableName, columns, primaryKeys } = draft.json.createQuery;

  if (columns.length === 0) {
    setFailedResponse("Columns are missing");
    return;
  }
  if (primaryKeys.length === 0) {
    setFailedResponse("Primary Keys are missing");
    return;
  }

  // columns 체크
  const types = [
    "string",
    "integer",
    "biginteger",
    "boolean",
    "date",
    "datetime",
    "decimal",
  ];
  const checkColumns = columns.every((column) => {
    return column.name && types.includes(column.type);
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

  const sqlBuilder = mysql.table.create(tableName, (table) => {
    table.charset("utf8mb4");
    columns.forEach((column) => {
      switch (column.type) {
        case "string": {
          if (column.notNullable && column.notNullable === true) {
            table.string(column.name).notNullable();
          } else {
            table.string(column.name);
          }
          break;
        }
        case "integer": {
          if (column.notNullable && column.notNullable === true) {
            table.integer(column.name).notNullable();
          } else {
            table.integer(column.name);
          }
          break;
        }
        case "biginteger": {
          if (column.notNullable && column.notNullable === true) {
            table.bigInteger(column.name).notNullable();
          } else {
            table.bigInteger(column.name);
          }
          break;
        }
        case "boolean": {
          if (column.notNullable && column.notNullable === true) {
            table.boolean(column.name).notNullable();
          } else {
            table.boolean(column.name);
          }
          break;
        }
        case "date":
        case "datetime": {
          if (column.notNullable && column.notNullable === true) {
            table
              .dateTime(column.name, { useTz: true, precision: 6 })
              .notNullable();
          } else {
            table.dateTime(column.name, { useTz: true, precision: 6 });
          }
          break;
        }
        case "decimal": {
          if (column.notNullable && column.notNullable === true) {
            table
              .decimal(column.name, column.precision || 18, column.scale || 3)
              .notNullable();
          } else {
            table.decimal(
              column.name,
              column.precision || 18,
              column.scale || 3
            );
          }
          break;
        }
      }
    });
    table.boolean("DELETED").notNullable().defaultTo(false);
    table
      .dateTime("CREATED_AT", { useTz: true, precision: 6 })
      .notNullable()
      .defaultTo(mysql.fn.now(6));
    table.string("CREATED_BY").notNullable();
    table
      .dateTime("UPDATED_AT", { useTz: true, precision: 6 })
      .notNullable()
      .defaultTo(mysql.fn.now(6));
    table.string("UPDATED_BY").notNullable();

    table.primary(primaryKeys);
  });

  draft.response.body = await sqlBuilder.run();
};

/*
tableName: "...",
columns: [
{
  name: string
  type: [
    "string" | 
    "integer" | 
    "biginteger" | 
    "boolean" | 
    "date" | 
    "datetime" | 
    "decimal"
  ]
  notNullable?: boolean
  precision?: number
  scale?: number
},
{...}, {...}, ...
],
primaryKeys: ["...", "...", ...]
*/
