module.exports.getDB_Object = (data, { key, contractID, makeid }) => {
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
      dmbtr: (data.form.dmbtr || "").replace(/,/g, ""),
      dmbtr_local: (data.form.dmbtr_local || "").replace(/,/g, ""),
      curr_local: data.form.curr_local,
      status: data.form.status,
    };
  }
  switch (key) {
    case "ref_doc": {
      return data.billList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        // type:
        // item_id:
        // doc_id:
      }));
    }
    case "cost_object": {
      return data.costObjectList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        type: item.type,
        cost_object_id: item.cost_object_id,
        name: item.name,
        cost_type: item.cost_type,
        dmbtr: (item.dmbtr || "").replace(/,/g, ""),
        dmbtr_local: (item.dmbtr_local || "").replace(/,/g, ""),
        start_date: item.start_date,
        end_date: item.end_date,
      }));
    }
    case "bill": {
      return data.billList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        cost_object_id: item.cost_object_id,
        post_date: item.post_date,
        reason_text: item.reason_text,
        dmbtr: (item.dmbtr || "").replace(/,/g, ""),
        dmbtr_local: (item.dmbtr_local || "").replace(/,/g, ""),
        curr_key: item.curr_key,
        curr_local: item.curr_local,
      }));
    }
    case "party": {
      return data.partyList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        stems10: item.stems10,
        stems10_cn: item.stems10_cn,
        stems10_ko: item.stems10_ko,
        name: item.name,
        ref_id: item.ref_id,
        type: item.type,
      }));
    }
    case "attachment": {
      return data.attachmentList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        type: item.type,
        name: item.name,
        path: [`${contractID}` || item.contractID, item.name].join("/"),
        ext: item.ext,
      }));
    }
    default:
      break;
  }
};

module.exports.getChange_Object = ({ tableKey, data, userID, makeid }) => {
  switch (tableKey) {
    case "contract": {
      return {
        type: tableKey,
        row_key: data.id,
        id: makeid && makeid(5),
        changed_by: userID,
        content: JSON.stringify(data),
      };
    }
    default:
      break;
  }
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD", hour = 0) => {
  if (!dateStr) {
    return "";
  }
  let date;
  if (typeof dateStr === "string") {
    if (/^\d{1,}$/.test(dateStr)) {
      date = dateStr;
    } else {
      const numberString = dateStr.replace(/^\/Date\(/, "").replace(")/", "");
      if (/^\d{1,}$/.test(numberString)) {
        date = new Date(parseInt(numberString, 10));
      } else date = numberString;
    }
  }
  return dayjs(date).add(hour, "hour").format(format);
};

module.exports.convDate = convDate;
