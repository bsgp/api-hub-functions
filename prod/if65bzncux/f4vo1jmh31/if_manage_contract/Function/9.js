module.exports = async (draft, { sql }) => {
  const { tables } = draft.json;
  // const tableData = {
  //   type: "contract",
  //   row_key: "1",
  //   id: "12344",
  //   changed_by: "test",
  //   content: JSON.stringify({ id: 123, test: "test" }),
  // };
  // const postTableData = await sql("mysql", { useCustomRole: false })
  //   .insert(tables["change"].name, tableData)
  //   .run();

  const postTableData = await sql("mysql", { useCustomRole: false })
    .select(tables["change"].name)
    .run();

  draft.response.body = {
    postTableData,
  };
};
