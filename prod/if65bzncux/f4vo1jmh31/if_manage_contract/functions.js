module.exports.getDB_Object = (data, { key, contractID, makeid, user }) => {
  if (key === "contract") {
    return {
      id: data.form.contractID,
      prod_date: data.form.prod_date,
      bukrs: user && user.bukrs,
      name: data.form.name,
      type: data.form.type,
      start_date: data.form.start_date,
      end_date: data.form.end_date,
      renewal_ind: data.form.renewal_ind,
      renewal_period: data.form.renewal_period,
      curr_key: data.form.curr_key,
      curr_local: data.form.curr_local,
      dmbtr_supply: (data.form.dmbtr_supply || "").replace(/,/g, ""),
      dmbtr_vat: (`${data.form.dmbtr_vat}` || "").replace(/,/g, ""),
      dmbtr: (`${data.form.dmbtr}` || "").replace(/,/g, ""),
      dmbtr_supply_local: (data.form.dmbtr_supply_local || "").replace(
        /,/g,
        ""
      ),
      dmbtr_vat_local: (data.form.dmbtr_vat_local || "").replace(/,/g, ""),
      dmbtr_local: (data.form.dmbtr_local || "").replace(/,/g, ""),
      status: data.form.status,
      payment_terms: data.form.payment_terms,
      claims_time: data.form.claims_time,
      contract_deposit: data.form.contract_deposit,
      f_payment_return_deposit: data.form.f_payment_return_deposit,
      warr_haja_deposit: data.form.warr_haja_deposit,
      delayed_money: data.form.delayed_money,
      etc: data.form.etc,
      uni_coregno: data.form.uni_coregno,
      uni_contsts: data.form.uni_contsts,
      uni_contseq: data.form.uni_contseq,
      uni_contstsname: data.form.uni_contstsname,
      uni_contno: data.form.uni_contno,
      uni_contdate: data.form.uni_contdate,
      uni_contname: data.form.uni_contname,
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
        cost_type_id: item.cost_type_id,
        cost_type: item.cost_type,
        dmbtr_supply: (item.dmbtr_supply || "").replace(/,/g, ""),
        dmbtr_supply_local: (item.dmbtr_supply_local || "").replace(/,/g, ""),
        dmbtr_vat: (item.dmbtr_vat || "").replace(/,/g, ""),
        dmbtr_vat_local: (item.dmbtr_vat_local || "").replace(/,/g, ""),
        matnr: item.matnr,
        maktx: item.maktx,
        post_date: item.post_date,
        po_number: item.po_number,
        po_item_no: item.po_item_no,
        loekz: (item.loekz && "X") || "",
      }));
    }
    case "actual_billing": {
      return data.actualBillng.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        parent_id: item.parent_id,
        index: `${item.index}`,
        type: item.type,
        cost_object_id: item.cost_object_id,
        name: item.name,
        cost_type_id: item.cost_type_id,
        cost_type: item.cost_type,
        gl_account_id: item.gl_account_id,
        gl_account: item.gl_account,
        dmbtr_supply: (item.dmbtr_supply || "").replace(/,/g, ""),
        dmbtr_supply_local: (item.dmbtr_supply_local || "").replace(/,/g, ""),
        dmbtr_vat: (item.dmbtr_vat || "").replace(/,/g, ""),
        dmbtr_vat_local: (item.dmbtr_vat_local || "").replace(/,/g, ""),
        post_date: item.post_date,
        docu_date: item.docu_date,
        remark: item.remark,
        fi_gjahr: item.fi_gjahr,
        fi_number: item.fi_number,
        fi_item_no: item.fi_item_no,
        origin_item_index: item.origin_item_index,
      }));
    }
    case "wbs": {
      return data.wbsList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        type: item.type,
        cost_object_id: item.cost_object_id,
        name: item.name,
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
        post_date: item.post_date,
        remark: item.remark,
        dmbtr_supply: (item.dmbtr_supply || "").replace(/,/g, ""),
        dmbtr_vat: (item.dmbtr_vat || "").replace(/,/g, ""),
        // curr_key: item.curr_key,
        // curr_local: item.curr_local,
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
        gl_group_id: item.gl_group_id,
        gl_group_text: item.gl_group_text,
        ref_id: item.ref_id,
        type: item.type,
        prdnt_name: item.prdnt_name,
        id_no: item.id_no,
        biz_no: item.biz_no,
        land_id: item.land_id,
        address: item.address,
        tel: item.tel,
      }));
    }
    case "attachment": {
      return data.attachmentList.map((item) => ({
        contract_id: `${contractID}` || item.contractID,
        id: item.id || (makeid && makeid(5)),
        index: `${item.index}`,
        type: item.type,
        name: item.name,
        desc: item.desc,
        path: [`${contractID}` || item.contractID, item.name].join("/"),
        ext: item.ext,
      }));
    }
    default:
      break;
  }
};

module.exports.getChange_Object = ({
  tableKey,
  data,
  userID,
  makeid,
  operation = "U",
}) => {
  const defaultObj = {
    type: tableKey,
    id: makeid && makeid(5),
    changed_by: userID,
    operation,
    content: JSON.stringify(data),
  };
  switch (tableKey) {
    case "contract": {
      return {
        row_key: data.id,
        ...defaultObj,
      };
    }
    default: {
      return {
        row_key: [data.contract_id, data.id].join("#"),
        ...defaultObj,
      };
    }
  }
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD HH:mm:ss", hour = 9) => {
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

module.exports.sortIndexFn = (arr = []) =>
  arr.sort((al, be) => Number(al.index) - Number(be.index));

const removeCommas = (val) => {
  return String(val).replace(/,/g, "").replace(/\s/g, "");
};

function numberWithCommas(xx, options = {}) {
  const { noTraillingZeroInDecimal = true } = options;
  if (xx === undefined) {
    return "0";
  }
  const parts = removeCommas(xx.toString()).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts[1] && noTraillingZeroInDecimal === true) {
    parts[1] = parts[1].replace(/0+$/, "");
    if (parts[1] === "") {
      return parts[0];
    }
  }
  return parts.join(".");
}
module.exports.numberWithCommas = numberWithCommas;
