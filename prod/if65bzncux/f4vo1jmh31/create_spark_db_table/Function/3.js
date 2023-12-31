module.exports = async (draft, { file, env }) => {
  let configFile;
  try {
    configFile = await file.get("config/tables.json", {
      gziped: true,
      stage: env.CURRENT_ALIAS,
    });
  } catch (err) {
    draft.response.body = { configFileMessage: "new Config file created" };
  }
  const lastestTableConfig = (configFile && JSON.parse(configFile)) || {};
  /**
   * db 업데이트 시
   * Function#3 table name의 number++ && Functions: schema update
   */

  // const tables = {
  //   change: { name: "change_6", desc: "Spark DB change history table" },
  //   contract: { name: "contract_8", desc: "Contract info DB table" },
  //   changed_contract: {
  //     name: "changed_contract_1",
  //     desc: "Changed Contract seq info DB table",
  //   },
  //   ref_doc: {
  //     name: "ref_doc_9",
  //     desc: "Reference document(MM,FI) info DB table",
  //   },
  //  cost_object:{name:"cost_object_10", desc: "MM,FI cost object DB table" },
  //   wbs: { name: "wbs_0", desc: "WBS DB table" },
  //   bill: { name: "bill_11", desc: "bill reson text DB" },
  //   actual_billing: {
  //     name: "actual_billing_1",
  //     desc: "Actual FI cost object DB table",
  //   },
  //   party: { name: "party_10", desc: "Party(supplier, customer) info DB" },
  //   attachment: { name: "attachment_8", desc: "Attachment info DB" },
  //   letter_appr: {
  //     name: "letter_appr_5",
  //     desc: "groupware letter approval info DB",
  //   },
  // };
  const tables = {
    change: {
      name: "change_15",
      desc: "Spark DB change history table",
    },
    contract: {
      name: "contract_15",
      desc: "Contract info DB table",
    },
    changed_contract: {
      name: "changed_contract_15",
      desc: "Changed Contract seq info DB table",
    },
    ref_doc: {
      name: "ref_doc_15",
      desc: "Reference document(MM,FI) info DB table",
    },
    cost_object: {
      name: "cost_object_15",
      desc: "MM,FI cost object DB table",
    },
    wbs: {
      name: "wbs_15",
      desc: "WBS DB table",
    },
    bill: {
      name: "bill_15",
      desc: "bill reson text DB",
    },
    actual_billing: {
      name: "actual_billing_15",
      desc: "Actual FI cost object DB table",
    },
    party: {
      name: "party_15",
      desc: "Party(supplier, customer) info DB",
    },
    attachment: {
      name: "attachment_15",
      desc: "Attachment info DB",
    },
    letter_appr: {
      name: "letter_appr_15",
      desc: "groupware letter approval info DB",
    },
    unmap_letters: {
      name: "unmap_letters_15",
      desc: "groupware unMapped letter approval info DB",
    },
  };
  // draft.json.changed = { ...lastestTableConfig };
  // draft.response.body = { changed: { ...draft.json.changed }, tables };

  // await file.upload("config/tables.json", draft.json.changed, {
  //   gzip: true,
  //   stage: env.CURRENT_ALIAS,
  // });

  const newTableConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
    stage: env.CURRENT_ALIAS,
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
