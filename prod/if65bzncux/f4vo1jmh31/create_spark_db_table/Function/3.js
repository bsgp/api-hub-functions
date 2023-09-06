module.exports = async (draft, { file }) => {
  const tables = {
    change: {
      name: "change_0",
      desc: "Spark DB change history table",
    },
    contract: {
      name: "contract_0",
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

  const tableConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  draft.json.tables = tables;
  draft.response.body = { tableConfig };
};
