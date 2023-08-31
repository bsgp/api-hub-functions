module.exports = async (draft, { sql }) => {
  // const tableName = ["def_table", "opr_table",
  // "mapping_table", "data_table"];
  const {
    // tbOpr, tbDef,
    tbMap,
    tbData,
  } = draft.json;
  const result = [];

  try {
    const query = sql("mysql");
    // const def_table = await query.select("def_table8").run();
    // const opr_table = await query.select("opr_table8").run();
    const mapping_table = await query.select(tbMap).run();
    const data_table = await query.select(tbData).run();

    result.push(
      "Function#5 NOT err",
      // "def_table",
      // def_table,
      // "opr_table",
      // opr_table,
      "mapping_table",
      mapping_table,
      "data_table",
      data_table
    );
  } catch (err) {
    console.log("Function#5 err", err);
    result.push(err);
  }

  draft.response.body = result;
};
