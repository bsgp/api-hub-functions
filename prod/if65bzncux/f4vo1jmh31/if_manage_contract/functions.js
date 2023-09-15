module.exports.getDB_Object = (data, key) => {
  if (key === "contract") {
    return {
      // id
      prod_date: data.form.prod_date,
      bukrs: data.form.bukrs,
      name: data.form.name,
      type: data.form.type,
      start_date: data.form.start_date,
      end_date: data.form.end_date,
      renewal_ind: data.form.renewal_ind,
      renewal_period: data.form.renewal_period,
      curr_key: data.form.curr_key,
      dmbtr: data.form.dmbtr,
      dmbtr_local: data.form.dmbtr_local,
      curr_local: data.form.curr_local,
      status: data.form.status,
    };
  }
};
