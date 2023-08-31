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
    const IncomingInv_Params = {
      PSTNGDATE_RA: [
        { SIGN: "I", OPTION: "BT", LOW: `${FROM}`, HIGH: `${TO}` },
      ],
      VENDOR_RA: [{ SIGN: "I", OPTION: "EQ", LOW: VENDOR, HIGH: "" }],
    };
    draft.pipe.json.IncomingInv_Params = IncomingInv_Params;
    draft.pipe.json.connection = {
      ashost: env.RFC_ASHOST,
      client: env.RFC_CLIENT,
      user: env.RFC_USER,
      passwd: env.RFC_PASSWORD,
      lang: "en",
    };
    draft.response.body = { IncomingInv_Params };
    draft.json.nextNodeKey = "RFC#4";
  }
};
