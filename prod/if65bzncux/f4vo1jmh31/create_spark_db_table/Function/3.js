module.exports = async (draft, { file }) => {
  let configFile;
  try {
    configFile = await file.get("config/tables.json", { gziped: true });
  } catch (err) {
    draft.response.body = { configFileMessage: "new Config file created" };
  }
  const lastestTableConfig = (configFile && JSON.parse(configFile)) || {};
  /**
   * db 업데이트 시
   * Function#3 table name의 number++ && Functions: schema update
   */
  const tables = {
    change: {
      name: "change_1",
      desc: "Spark DB change history table",
    },
    contract: {
      name: "contract_1",
      desc: "Contract info DB table",
    },
    ref_doc: {
      name: "ref_doc_1",
      desc: "Reference document(MM,FI) info DB table",
    },
    cost_object: {
      name: "cost_object_1",
      desc: "WBS, CostCenter info DB table",
    },
    bill: {
      name: "bill_1",
      desc: "bill reson text DB",
    },
    party: {
      name: "party_1",
      desc: "Party(supplier, customer) info DB",
    },
    letter_appr: {
      name: "letter_appr_1",
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
  draft.json.changed = changed;
  draft.response.body = { tableConfig: newTableConfig, changed };
};
