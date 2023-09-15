module.exports = async (draft) => {
  // const {tables,newData } = draft.json;
  // const {form, partyList, costObjectList, billList, attachmentList} = newData
  // const contract = {
  //   // id:  auto increase
  //   prod_date: form.prod_date,
  // bukrs: form.bukrs,
  // name: form.name,
  // type: form.type,
  // start_date: form.start_date,
  // end_date: form.end_date,
  // renewal_ind: form.renewal_ind,
  // renewal_period: form.renewal_period,
  // curr_key: form.curr_key,
  // dmbtr: form.dmbtr,
  // dmbtr_local: form.dmbtr_local,
  // curr_local: form.curr_local,
  // status: form.status
  // };

  // const builder = sql("mysql");
  // const contractValidator = await builder.validator(table);

  // const ref_doc = [];
  // const cost_object = [];
  // const bill = [];
  // const party = [];

  draft.response.body = {
    request_contractID: draft.json.newData.contractID,
    tables: draft.json.tables,
    contract: {
      type: "P",
      contractID: "7775577",
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
    },
    E_STATUS: "S",
    E_MESSAGE: "TEST",
  };
};
