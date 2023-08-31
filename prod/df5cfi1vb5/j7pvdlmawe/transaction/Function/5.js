module.exports = async (draft, { request, util, sql }) => {
  const { method, table } = draft.pipe.json;
  if (method !== "GET") {
    return;
  }

  const params = util.upKeys(request.params);
  let lotno = [];
  if (params.LOTNO) {
    if (util.type.isString(params.LOTNO)) {
      lotno = params.LOTNO.toUpperCase().split(",");
    }
  }
  const routg = params.ROUTG && params.ROUTG.toUpperCase();
  const budat = params.BUDAT;
  const budatTo = params.BUDAT_TO;
  const from = params.FROM;
  const to = params.TO;

  const query = sql("mysql").select(table);
  if (from && to) {
    const offset = from - 1;
    const limit = to - offset;
    query.limit(limit).offset(offset);
  }

  if (lotno.length > 0) {
    query.where("LOTNO", "in", lotno);
  }
  if (routg) {
    const routgList = routg.split(",");
    query.where("ROUTG", "in", routgList);
  }

  if (budat && budatTo) {
    query.whereBetween("BUDAT", [budat, budatTo]);
  } else if (budat) {
    query.where("BUDAT", budat);
  }
  query.orderBy("UPDATED_AT");
  const result = await query.run();

  draft.response = result;
  // draft.response.body = {
  //     type: util.type.isArray(lotno),
  //     lotno,
  //     };
};
