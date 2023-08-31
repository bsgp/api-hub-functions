module.exports = async (draft, { request }) => {
  if (draft.response.body.errorMessage) {
    return;
  }

  // const { isBuffer } = lib;
  const { table } = draft.pipe.json;

  const { builder } = draft.pipe.ref;
  const { APPR_MNG_NO } = request.body.Data;

  const query = builder.select(table);
  query.where("APPR_MNG_NO", APPR_MNG_NO);
  query.where("APPR_STS_CD", "00");

  const selResult = await query.run();
  draft.response = selResult;

  if (selResult.body.count === 0) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: [
        "선택한 조건으로 조회할수 없습니다.",
        `WHERE APPR_MNG_NO = ${APPR_MNG_NO} AND APPR_STS_CD = "00"`,
      ].join(" "),
    };
  } else if (selResult.body.count === 1) {
    const data = selResult.body.list[0];
    // if (isBuffer(data.APPR_CN_DATA)) {
    //   data.APPR_CN_DATA = data.APPR_CN_DATA.toString();
    // }
    // if (isString(data.APPR_CN_DATA)) {
    //   // data.APPR_CN_DATA = data.APPR_CN_DATA.replace(/\n/g, "");
    //   data.APPR_CN_DATA = JSON.parse(data.APPR_CN_DATA);
    // }

    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "조회되었습니다",
      Data: data,
    };
  }
};
