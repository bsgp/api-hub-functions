module.exports = async (draft, { file }) => {
  const interfaces = {
    ["IF-CO-3200"]: {
      Type: "RFC",
      Name: "ZCOT3200",
      IsSapTable: true,
      PartitionKey: "BDATJ",
      PartitionFormat: "yyyy",
      FileKey: "BUKRS",
    },
    ["IF-CO-3062"]: {
      Type: "RFC",
      Name: "ZCOT3062",
      IsSapTable: true,
      PartitionKey: "BDATJ",
      PartitionFormat: "yyyy",
      FileKey: "BUKRS",
    },
    ["IF-PP-0770"]: {
      Type: "RFC",
      Name: "ZPPT0770",
      IsSapTable: true,
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "WERKS",
    },
    ["IF-FI-0028"]: {
      Type: "RFC",
      Name: "ZFIT0028",
      IsSapTable: true,
      PartitionKey: "SENDDT",
      PartitionFormat: "yyyyMMdd",
      FileKey: "SENDDT",
    },
  };

  await file.upload("if/list.json", interfaces, {
    gzip: true,
    ignoreEfs: true,
  });
  const url = await file.getUrl("if/list.json");

  draft.response.body = {
    url,
    count: Object.keys(interfaces).length,
    list: interfaces,
  };
};
