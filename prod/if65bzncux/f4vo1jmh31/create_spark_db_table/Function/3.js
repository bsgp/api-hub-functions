module.exports = async (draft, { file }) => {
  const configFile = await file.get("config/tables.json", { gziped: true });
  const lastestTableConfig = JSON.parse(configFile);
  /**
   * db 업데이트 시
   * table name의 number++ && function update
   */
  const tables = {
    change: {
      name: "change_999",
      desc: "Spark DB change history table",
    },
    contract: {
      name: "contract_999",
      desc: "Contract info DB table",
    },
    ref_doc: {
      name: "ref_doc_0",
      desc: "Reference document(MM,FI) info DB table",
    },
    cost_object: {
      name: "cost_object_0",
      desc: "WBS, CostCenter info DB table",
    },
    bill: {
      name: "bill_0",
      desc: "bill reson text DB",
    },
    party: {
      name: "party_0",
      desc: "Party(supplier, customer) info DB",
    },
    letter_appr: {
      name: "letter_appr_0",
      desc: "groupware letter approval info DB",
    },
  };

  const newTableConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });

  const changed = Object.keys(tables).reduce((acc, curr) => {
    if (
      !lastestTableConfig[curr] ||
      tables[curr].name !== lastestTableConfig[curr].name
    ) {
      acc[curr] = tables[curr];
    }
    return acc;
  }, {});
  draft.json.tables = tables;
  draft.response.body = { tableConfig: newTableConfig, changed };
};
