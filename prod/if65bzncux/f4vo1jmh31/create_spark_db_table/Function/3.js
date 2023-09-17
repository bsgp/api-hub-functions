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
      name: "change_3",
      desc: "Spark DB change history table",
    },
    contract: {
      name: "contract_4",
      desc: "Contract info DB table",
    },
    ref_doc: {
      name: "ref_doc_4",
      desc: "Reference document(MM,FI) info DB table",
    },
    cost_object: {
      name: "cost_object_4",
      desc: "WBS, CostCenter info DB table",
    },
    bill: {
      name: "bill_4",
      desc: "bill reson text DB",
    },
    party: {
      name: "party_5",
      desc: "Party(supplier, customer) info DB",
    },
    attachment: {
      name: "attachment_2",
      desc: "Attachment info DB",
    },
    letter_appr: {
      name: "letter_appr_3",
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
