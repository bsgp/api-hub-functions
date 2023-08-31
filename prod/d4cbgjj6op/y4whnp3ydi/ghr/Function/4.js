module.exports = async (draft, { request, lib }) => {
  const { table, ifId } = draft.pipe.json;
  if (table.ghr !== "PW_IF_COST_CENTER_T") {
    return;
  }

  const { isArray, tryit } = lib;

  const data = request.body.Data;
  const dataList = isArray(data) ? data : [data];

  const builder = draft.pipe.ref.builderGhr;

  const query = builder.multi(table.ghr);
  dataList.forEach((each) => {
    query.add(function () {
      const data = {
        COMPANY: each.BUKRS,
        COSTCT: each.KOSTL,
        EFFDT: each.DATAB,
        COSTCT_NM: each.KTEXT,
        COSTCT_TYPE: each.KOSAR,
      };

      this.insert(data);
      // this.raw(query.knex.raw(sqlStatement, { data }));
    });
  });
  const result = await query.run();
  draft.response = result;

  if (result.body.code === "S") {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table.ghr,
      E_STATUS: "S",
      E_MESSAGE: "성공하였습니다",
    };
  } else {
    const lastQuery = tryit(
      () => result.body.list[result.body.list.length - 1]
    );
    const errorMessage = lastQuery ? lastQuery.result.message : "";
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table.ghr,
      E_STATUS: "F",
      E_MESSAGE: errorMessage || "실패하였습니다",
    };
  }
};
