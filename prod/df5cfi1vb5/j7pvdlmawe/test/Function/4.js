module.exports = async (draft, { sql }) => {
  const { method, table } = draft.pipe.json;
  if (method !== "GET") {
    return;
  }

  // 	const { type } = util;

  // 	const params = util.upKeys(request.params);
  // 	let lotno = [];
  // 	if(params.LOTNO){
  // 	    if(util.type.isString(params.LOTNO)){
  // 	        lotno = params.LOTNO.toUpperCase().split(",");
  // 	    }
  // 	}
  // 	const routg = params.ROUTG && params.ROUTG.toUpperCase();
  // 	const budat = params.BUDAT;

  //   const query = sql("mysql").update(table, { DEFNC: "" });
  const query = sql("mysql").select(table);
  query.where("INSTP", "S");
  query.whereNot("DEFNC", "");

  query.orderBy("UPDATED_AT");
  const result = await query.run();

  draft.response = result;
};
