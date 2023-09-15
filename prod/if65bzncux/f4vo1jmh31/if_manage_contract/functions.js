module.exports.getDB_Object = (data, key, contract_id) => {
  if (key === "contract") {
    return {
      id: data.form.contractID,
      prod_date: data.form.prod_date,
      bukrs: data.form.bukrs,
      name: data.form.name,
      type: data.form.type,
      start_date: data.form.start_date,
      end_date: data.form.end_date,
      renewal_ind: data.form.renewal_ind,
      renewal_period: data.form.renewal_period,
      curr_key: data.form.curr_key,
      dmbtr: data.form.dmbtr.replace(/,/g, ""),
      dmbtr_local: data.form.dmbtr_local.replace(/,/g, ""),
      curr_local: data.form.curr_local,
      status: data.form.status,
    };
  }
  switch (key) {
    case "ref_doc": {
      return data.billList.map((item) => ({
        contract_id: contract_id || item.contract_id,
        id: item.id,
        // type:
        // item_id:
        // doc_id:
      }));
    }
    case "cost_object": {
      return data.costObjectList.map((item) => ({
        contract_id: contract_id || item.contract_id,
        id: item.id,
        type: item.type,
        cost_object_id: item.cost_object_id,
        name: item.name,
        cost_type: item.cost_type,
        dmbtr: item.dmbtr.replace(/,/g, ""),
        dmbtr_local: item.dmbtr_local.replace(/,/g, ""),
        start_date: item.start_date,
        end_date: item.end_date,
      }));
    }
    case "bill": {
      return data.billList.map((item) => ({
        contract_id: contract_id || item.contract_id,
        id: item.id,
        cost_object_id: item.cost_object_id,
        reason_text: item.reason_text,
        dmbtr: item.dmbtr.replace(/,/g, ""),
        dmbtr_local: item.dmbtr_local.replace(/,/g, ""),
        curr_key: item.curr_key,
        curr_local: item.curr_local,
      }));
    }
    case "party": {
      return data.partyList.map((item) => ({
        contract_id: contract_id || item.contract_id,
        id: item.id,
        stems10_cn: item.stems10_cn,
        stems10_ko: item.stems10_ko,
        name: item.name,
        ref_id: item.ref_id,
        type: item.type,
      }));
    }
    default:
      break;
  }
};
