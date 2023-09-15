module.exports = async (draft) => {
  // const tables = draft.json.tables;
  // const contract = {
  //   // id:  auto increase
  //   prod_date:
  // bukrs
  // name
  // type
  // start_date
  // end_date
  // renewal_ind
  // renewal_period
  // curr_key
  // dmbtr
  // dmbtr_local
  // curr_local
  // status
  // };
  // const ref_doc = [];
  // const cost_object = [];
  // const bill = [];
  // const party = [];

  draft.response.body = {
    request_contractID: draft.json.newData.contractID,
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
