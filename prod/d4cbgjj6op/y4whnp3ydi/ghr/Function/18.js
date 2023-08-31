module.exports = async (draft) => {
  const { table, currentTimeString } = draft.pipe.json;
  const { builderGhr, resultGhr, resGw } = draft.pipe.ref;
  const resultGw = draft.response;

  if (resultGw.statusCode === 200) {
    const queryGhr2 = builderGhr.multi(table.ghr);
    resultGw.body.list.forEach((each) => {
      const eachGw = resGw[each.index];

      let TRANSFER_STATUS = "S";
      let TRANSFER_MESSAGE = "성공";
      const TRANSFER_HRS = currentTimeString;

      if (each.code === "F") {
        TRANSFER_STATUS = "E";
        TRANSFER_MESSAGE = each.result.errorMessage || "실패";
      }

      eachGw.TRANSFER_STATUS = TRANSFER_STATUS;
      eachGw.TRANSFER_MESSAGE = TRANSFER_MESSAGE;
      eachGw.TRANSFER_HRS = TRANSFER_HRS;

      const eachGhr = resultGhr.body.list[each.index];
      queryGhr2.add(function () {
        this.update({
          TRANSFER_STATUS,
          TRANSFER_MESSAGE,
          TRANSFER_HRS,
        }).where("IF_GW_SEQ", eachGhr.IF_GW_SEQ);
      });
    });
    await queryGhr2.run();

    draft.response.body = {
      count: resGw.length,
      list: resGw,
      E_STATUS: "S",
      E_MESSAGE: `${resGw.length}건을 처리하였습니다`,
    };
  }
};
