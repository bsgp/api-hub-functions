module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const ADR2 = draft.pipe.json.ADR2;
  const ADR6 = draft.pipe.json.ADR6;
  const ADR2_Fields = draft.pipe.json.ADR2_FIELDS;
  const ADR6_Fields = draft.pipe.json.ADR6_FIELDS;

  const ADR2_Data = tryit(() => ADR2.body.result.DATA, []);
  const ADR6_Data = tryit(() => ADR6.body.result.DATA, []);

  const ADR2_Conversion = [];
  const ADR6_Conversion = [];
  try {
    ADR2_Data.forEach((item) => {
      const conversion = {};
      item.WA.split("|").forEach((item, idx) => {
        conversion[ADR2_Fields[idx].id] =
          item.replace(/(^\s+)|(\s+$)/g, "") || " ";
      });
      ADR2_Conversion.push(conversion);
    });
    ADR6_Data.forEach((item) => {
      const conversion = {};
      item.WA.split("|").forEach((item, idx) => {
        conversion[ADR6_Fields[idx].id] =
          item.replace(/(^\s+)|(\s+$)/g, "") || " ";
      });
      ADR6_Conversion.push(conversion);
    });
    const conversion = draft.response.body.conversion;
    const TEL = (ADR2_Conversion.find((adr) => adr.R3 === "1") || {}).TEL;
    const MOBILE = (ADR2_Conversion.find((adr) => adr.R3 === "3") || {}).TEL;
    const EMAIL = (ADR6_Conversion.find((adr) => adr.FLGDEFAULT === "X") || {})
      .EMAIL;
    conversion.TEL = TEL;
    conversion.MOBILE = MOBILE;
    conversion.EMAIL = EMAIL;
    draft.response.body.ADR2_Conversion = ADR2_Conversion;
    draft.response.body.ADR6_Conversion = ADR6_Conversion;
  } catch (error) {
    draft.response.body.message = error.message;
    draft.response.body.ADR2_Data = ADR2_Data;
    draft.response.body.ADR2_Fields = ADR2_Fields;
  }
};
