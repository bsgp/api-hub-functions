module.exports = async (draft, { request, env }) => {
  const params = request.body;
  const VENDOR = params.VENDOR
    ? isNaN(Number(params.VENDOR))
      ? params.VENDOR.toUpperCase()
      : `${params.VENDOR}`.padStart(10, "0")
    : undefined;
  const FIELDS = [
    { FIELDNAME: "LIFNR", id: "VENDOR_ID" },
    { FIELDNAME: "NAME1", id: "VENDOR_TEXT" },
    { FIELDNAME: "STCD2", id: "VENDOR_NUMBER" },
    { FIELDNAME: "STCD1", id: "COMPANY_ID" },
    { FIELDNAME: "J_1KFTBUS", id: "BUSSINESS_TYPE" },
    { FIELDNAME: "J_1KFTIND", id: "INDUSTRY_TYPE" },
    { FIELDNAME: "J_1KFREPRE", id: "PRESIDENT" },
    { FIELDNAME: "LAND1", id: "COUNTRY_CODE" },
    { FIELDNAME: "REGIO", id: "REGION_TEXT" },
    { FIELDNAME: "ORT01", id: "ADDRESS1" },
    { FIELDNAME: "ORT02", id: "ADDRESS2" },
    { FIELDNAME: "PSTLZ", id: "POSTAL_CODE" },
    { FIELDNAME: "ADRNR", id: "ADRNR" },
  ];

  draft.pipe.json.FIELDS = FIELDS;
  draft.pipe.json.VENDOR_Params = {
    QUERY_TABLE: "LFA1",
    DELIMITER: "|",
    OPTIONS: [{ TEXT: `LIFNR EQ '${VENDOR}'` }],
    FIELDS: FIELDS.map((field) => ({ FIELDNAME: field.FIELDNAME })),
  };

  draft.pipe.json.connection = {
    ashost: env.RFC_ASHOST,
    client: env.RFC_CLIENT,
    user: env.RFC_USER,
    passwd: env.RFC_PASSWORD,
    lang: "en",
  };

  draft.response.body = { params };
};
