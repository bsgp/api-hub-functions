module.exports.getPayload = (SupplierInvoiceID, TransactionDate) => {
  const SupplierInvoice = {
    $: { actionCode: "02" },
    BusinessTransactionDocumentTypeCode: "004",
    TransactionDate,
    DocumentItemGrossAmountIndicator: false,
    SupplierInvoiceID,
    Status: { DataEntryProcessingStatusCode: "3" },
  };
  return {
    "soapenv:Envelope": {
      $: {
        "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "xmlns:glob": "http://sap.com/xi/SAPGlobal20/Global",
        "xmlns:glob1": "http://sap.com/xi/AP/Globalization",
      },
      "soapenv:Header": "",
      "soapenv:Body": {
        "glob:SupplierInvoiceBundleMaintainRequest_sync": {
          BasicMessageHeader: "",
          SupplierInvoice,
        },
      },
    },
  };
};
