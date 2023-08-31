module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const fields = draft.pipe.json.FIELDS;
  const vendor = draft.pipe.json.vendor;
  draft.response.body.vendor = vendor;
  draft.response.body.fields = fields;

  const vendorData = tryit(() => vendor.body.result.DATA[0].WA, "");
  const conversion = {};
  vendorData.split("|").forEach((item, idx) => {
    conversion[fields[idx].id] = item.replace(/(^\s+)|(\s+$)/g, "") || " ";
  });

  const ADR_FIELDS = [
    { FIELDNAME: "ADDRNUMBER", id: "ADRNR" },
    { FIELDNAME: "FLGDEFAULT", id: "FLGDEFAULT" },
    { FIELDNAME: "FLG_NOUSE", id: "FLG_NOUSE" },
    { FIELDNAME: "DFT_RECEIV", id: "DFT_RECEIV" },
    { FIELDNAME: "R3_USER", id: "R3" },
  ];
  const ADR2_FIELDS = [...ADR_FIELDS, { FIELDNAME: "TEL_NUMBER", id: "TEL" }];
  draft.pipe.json.ADR2_FIELDS = ADR2_FIELDS;
  draft.pipe.json.ADR2_Params = {
    QUERY_TABLE: "ADR2",
    DELIMITER: "|",
    OPTIONS: [{ TEXT: `ADDRNUMBER EQ '${conversion.ADRNR}'` }],
    FIELDS: ADR2_FIELDS.map((field) => ({ FIELDNAME: field.FIELDNAME })),
  };

  const ADR6_FIELDS = [...ADR_FIELDS, { FIELDNAME: "SMTP_ADDR", id: "EMAIL" }];

  draft.pipe.json.ADR6_FIELDS = ADR6_FIELDS;
  draft.pipe.json.ADR6_Params = {
    QUERY_TABLE: "ADR6",
    DELIMITER: "|",
    OPTIONS: [{ TEXT: `ADDRNUMBER EQ '${conversion.ADRNR}'` }],
    FIELDS: ADR6_FIELDS.map((field) => ({ FIELDNAME: field.FIELDNAME })),
  };

  draft.response.body.conversion = conversion;
  draft.response.body.E_STATUS = "S";
};
