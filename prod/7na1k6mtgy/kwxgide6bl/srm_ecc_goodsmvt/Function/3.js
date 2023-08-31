module.exports = async (draft, { request, env }) => {
  const params = request.body;
  const { FROM, TO } = params;
  const firstLetter = `${params.VENDOR}`[0];
  const VENDOR = params.VENDOR
    ? isNaN(Number(firstLetter))
      ? params.VENDOR.toUpperCase()
      : `${params.VENDOR}`.padStart(10, "0")
    : undefined;

  if (!FROM || !TO) {
    draft.response.body = { params, E_STATUS: "F", E_MESSAGE: "Wrong params" };
    draft.json.nextNodeKey = "Output#2";
  } else {
    const mvtCodeList = [
      { code: "101", type: "in" },
      { code: "102", type: "out" },
      { code: "105", type: "in" },
      { code: "106", type: "out" },
      { code: "162", type: "in" },
      { code: "161", type: "out" }, // 반품 품목
      { code: "123", type: "in" },
      { code: "122", type: "out" },
    ];

    const MOVE_TYPE_RA = mvtCodeList.map((mvt) => ({
      SIGN: "I",
      OPTION: "EQ",
      LOW: mvt.code,
    }));
    const GoodsMvt_Params = {
      MOVE_TYPE_RA,
      PSTNG_DATE_RA: [
        { SIGN: "I", OPTION: "BT", LOW: `${FROM}`, HIGH: `${TO}` },
      ],
      VENDOR_RA: [{ SIGN: "I", OPTION: "EQ", LOW: VENDOR, HIGH: "" }],
    };
    draft.pipe.json.GoodsMvt_Params = GoodsMvt_Params;
    draft.pipe.json.connection = {
      ashost: env.RFC_ASHOST,
      client: env.RFC_CLIENT,
      user: env.RFC_USER,
      passwd: env.RFC_PASSWORD,
      lang: "en",
    };
    draft.pipe.json.mvtCodeList = mvtCodeList;
    draft.response.body = { params, GoodsMvt_Params };
    draft.json.nextNodeKey = "RFC#4";
  }
};
