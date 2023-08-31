module.exports = async (draft, { file, log }) => {
  const tables = {
    log: {
      name: "EXCHANGE_2",
      desc: "341545 EXCHANGE DB",
    },
    system: {
      name: "CMS_SYSTEM_2",
      desc: "341545 CMS System DB",
    },
    tax: {
      name: "CMS_TAX_2",
      desc: "341545 CMS ProductTaxationCharacteristicsCode DB",
    },
    ledger: {
      name: "CMS_LEDGER_2",
      desc: "341545 CMS GeneralLedgerAccountAliasCode DB",
    },
    costCenter: {
      name: "CMS_CostCentre_2",
      desc: "341545 CMS CostCentreID DB",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
