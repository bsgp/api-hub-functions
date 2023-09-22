module.exports = async (draft, { sql }) => {
  const { tables } = draft.json;
  const tableData = {
    type: "contract",
    row_key: "1",
    id: "12344",
    changed_by: "test",
    content: "{'test': '123'}",
  };
  const postTableData = await sql("mysql", { useCustomRole: false })
    .insert(tables["change"].name, tableData)
    .run();

  draft.response.body = {
    postTableData,
  };
};
