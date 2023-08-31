module.exports = async (draft, { lib }) => {
  const { builderGw, resultGw } = draft.pipe.ref;
  const { table, ifId, keyColumns } = draft.pipe.json;
  const { tryit } = lib;

  const resultGhr = draft.response;

  if (resultGhr.statusCode === 200) {
    const queryGw2 = builderGw.multi(table.gw, { force: true });
    resultGhr.body.list.forEach((each) => {
      let TRANS_STATUS = "Y";
      let TRANS_MESSAGE = "성공";

      if (each.code === "F") {
        TRANS_STATUS = "N";
        TRANS_MESSAGE = each.result.message || "실패";
      }

      const eachGw = resultGw.body.list[each.index];
      queryGw2.add(function () {
        const subQuery = this.update({
          TRANS_STATUS,
          TRANS_MESSAGE,
        });
        keyColumns.forEach((col) => {
          subQuery.where(col, eachGw[col]);
          // subQuery.where("FormInstID", eachGw.FormInstID);
        });
      });
    });
    await queryGw2.run();
  }

  if (resultGhr.body.code === "S") {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table.ghr,
      E_STATUS: "S",
      E_MESSAGE: "성공하였습니다",
    };
  } else {
    // tryit(() => {});
    const failedQuery = tryit(() =>
      resultGhr.body.list.find((each) => each.code !== "S")
    );
    const totalCount = tryit(() => resultGhr.body.list.length, 0);
    const failedCount = tryit(
      () => resultGhr.body.list.filter((each) => each.code !== "S").length,
      0
    );
    const errorMessage = failedQuery ? failedQuery.result.message : "";
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table.ghr,
      E_STATUS: tryit(() => resultGhr.body.code) || "F",
      E_MESSAGE: errorMessage
        ? [totalCount, failedCount, errorMessage].join("/")
        : tryit(() => JSON.stringify(resultGhr.body), resultGhr.body) ||
          "실패하였습니다",
    };
  }
};
