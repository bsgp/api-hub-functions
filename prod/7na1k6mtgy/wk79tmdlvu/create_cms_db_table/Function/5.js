module.exports = async (draft, { sql }) => {
  const { tax, ledger, costCenter } = draft.pipe.json.tables;

  const setTable = (table) => {
    table.charset("utf8mb4");
    table.string("SYSTEM_ID").notNullable();
    table.string("ID").notNullable();
    table.string("TEXT").defaultTo("");
    table.string("COMPANY_ID").defaultTo("");
    table.boolean("IS_ACTIVATED").defaultTo("");
    table.string("COUNTRY_CODE").defaultTo("");
    table.boolean("DELETED").notNullable().defaultTo(false);
    table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.string("CREATED_BY").defaultTo("");
    table.string("UPDATED_BY").defaultTo("");
    table.primary(["SYSTEM_ID", "ID", "COMPANY_ID"]);
  };

  const mysql = sql("mysql");

  const taxDB = await mysql.table.create(tax.name, setTable).run();
  const ledgerDB = await mysql.table.create(ledger.name, setTable).run();
  const costCenterDB = await mysql.table
    .create(costCenter.name, setTable)
    .run();

  draft.response.body[tax.name] = taxDB;
  draft.response.body[ledger.name] = ledgerDB;
  draft.response.body[costCenter.name] = costCenterDB;
};
