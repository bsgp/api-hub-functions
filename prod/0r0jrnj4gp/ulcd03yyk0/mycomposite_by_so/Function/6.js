module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const { validate, pid, id, type, so, ci, od, bp, url } = draft.pipe.json;
  if (!validate) {
    return;
  }
  const searchBy = type === "CI" ? "CustomerInvoice" : "SalesOrder";
  const shippingAddress = so.ShipToLocation.ShipToLocationPostalAddress[0];
  const result = {
    searchBy,
    searchByID: id,
    soID: so.ID,
    soHeader: {
      date: so.DateTime,
      description: so.Name,
      externalReference: so.BuyerID,
      incotermsLocation: so.TransferLocationName,
      incotermsCode: so.ClassificationCode,
      incotermsCodeText: so.ClassificationCodeText,
      operation_date: so.DateTime, // need check
      patient: so.patient_KUT,
      patient_no: so.patientNo_KUT,
      paymentMethod: so.CashDiscountTerms.Code,
      paymentMethodText: so.CashDiscountTerms.CodeText,
      currencyCode: so.CurrencyCode,
      currencyCodeText: so.CurrencyCodeText,
      cancellationReasonCode: so.CancellationReasonCode,
      cancellationReasonCodeText: so.CancellationReasonCodeText,
      soShipToLocation: {
        soShipToLocationAddress: {
          cityName: shippingAddress.CityName,
          countryCode: shippingAddress.CountryCode,
          countryCodeText: shippingAddress.CountryCodeText,
          streetPostalCode: shippingAddress.StreetPostalCode,
          streetName: shippingAddress.StreetName,
        },
      },
    },
    soParties: so.Party.map((party) => {
      const address = party.Address;
      const postalAddress = tryit(() => address.PostalAddress[0] || {});
      const bpData = bp.find((item) => item.InternalID === party.PartyID) || {
        TaxNumber: [],
      };
      return {
        id: party.PartyID,
        displayName: address.FormattedName,
        role: party.RoleCategoryCode,
        roleText: party.RoleCategoryCodeText,
        tel: address.FormattedConventionalNumber,
        soPartyAddress: {
          cityName: postalAddress.CityName,
          countryCode: postalAddress.CountryCode,
          countryCodeText: postalAddress.CountryCodeText,
          streetPostalCode: postalAddress.StreetPostalCode,
          streetName: postalAddress.StreetName,
          regionCode: postalAddress.RegionCode,
          regionCodeText: postalAddress.RegionCodeText,
        },
        soPartyTaxes: bpData.TaxNumber.map((tn) => ({
          id: tn.PartyTaxID,
          type: tn.TaxIdentificationNumberTypeCode,
          country: tn.CountryCode,
        })),
      };
    }),
    soItems: tryit(
      () =>
        so.Items.map((item) => {
          const material = item.Material_V1;
          const fullName = tryit(
            () =>
              material.MaterialText.find((tx) => tx.LanguageCode === "KO").Text
          );
          const soMaterial = {
            id: material.InternalID,
            description: material.Description,
            hscode: material.code1_KUT,
            insurance_code: material.code3_KUT,
            long_desc: fullName,
            productRequirementSpecificationID: item.RequirementSpecificationID,
          };
          return {
            ivID: ci.ID,
            soID: so.ID,
            soItemID: item.ID,
            cancellationReasonCode: item.CancellationReasonCode,
            cancellationReasonCodeText: item.CancellationReasonCodeText,
            soMaterial,
            outboundDelivery: od.map((odInfo) => ({
              odID: odInfo.ID,
              shippingDate: odInfo.ShippingPeriod.StartDateTime,
              odItems2: odInfo.Item.filter((odItem) =>
                odItem.Reference.find(
                  (ref) =>
                    ref.TypeCode === "114" &&
                    ref.ID === so.ID &&
                    ref.ItemID === item.ID
                )
              ).map((odItem) => {
                const Logistics = odItem.LogisticsLotMaterial;
                const odDetailedItems2 = [];
                if (Logistics.length > 0) {
                  Logistics.forEach((lg) => {
                    if (lg.LogisticsChanges.length > 0) {
                      lg.LogisticsChanges.forEach((changes) =>
                        odDetailedItems2.push({
                          identifiedStockID: changes.LogisticsIStock.ID,
                          quantity: changes.Quantity,
                        })
                      );
                    }
                  });
                }
                if (odDetailedItems2.length === 0) {
                  odInfo.GAC.filter(
                    (gacItem) =>
                      gacItem.CancellationDocumentIndicator === false &&
                      gacItem.CancellationStatusCode !== "4"
                  ).forEach((gac) => {
                    const fItem = gac.GACChangeItem.find(
                      (gacItem) => gacItem.ODItem === odItem.ID
                    );
                    if (fItem) {
                      odDetailedItems2.push({
                        identifiedStockID: fItem.GACIStock.ID,
                        quantity: fItem.GACQuantity.Quantity,
                      });
                    }
                  });
                }
                return { odItemID: odItem.ID, odDetailedItems2 };
              }),
            })),
            ivHeader: {
              ivDate: ci.Date,
              ivTypeCode: ci.TypeCode,
              ivTypeCodeText: ci.TypeCodeText,
            },
          };
        }),
      []
    ),
  };

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "Saved Successfully",
    Data: { pid, so, od, ci, bp, id, type },
    Url: url,
    result,
  };
  draft.response.statusCode = 200;
};
