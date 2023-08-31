module.exports = async (draft, { env, odata, lib }) => {
  const { tryit, defined } = lib;
  const { params, username, password } = draft.json;
  // const { searchType, supplierID } = params;
  const { searchType } = params;

  const convAddress = (address) => {
    const regionText = address.RegionCodeText;
    const cityName = address.CityName;
    const additionalName = address.AdditionalCityName;
    const streetText = address.StreetName;
    const postalCode = address.StreetPostalCode;
    return [regionText, cityName, additionalName, streetText, postalCode];
  };

  if (searchType === "detail") {
    const idn = draft.response.body.conversion[0];
    const po = idn.list[0].purchaseOrderID;
    if (po) {
      const odataHeader = [
        `https://${env.BYD_URL}/sap/byd/odata/cust/v1/`,
        "bsg_purchaseorder/POCollection",
      ].join("");

      const queryParameters = ["$inlinecount=allpages", "$format=json"];
      const expand = [
        "EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
        "Item/PurchaseOrderReceivingItemSite",
        "Item/ItemShipToAddress/ItemShipToPostalAddress",
      ];
      const filter = [`ID eq '${po}'`];
      queryParameters.push(
        `$expand=${expand}`,
        `$filter=(${filter.join(") and (")})`
      );
      const queryString = queryParameters.join("&");
      const odataURL = [odataHeader, queryString].join("?");
      draft.json.poOData = odataURL;
      const poData = await odata.get({ url: odataURL, username, password });
      const poResult = poData.d.results[0] || {};
      const eParty = defined(poResult.EmployeeResponsibleParty, {});
      const shipToAddress = tryit(
        () =>
          poResult.Item[0].ItemShipToAddress.ItemShipToPostalAddress[0] || {},
        {}
      );

      draft.response.body.conversion[0] = {
        form: {
          ...idn.form,
          barcode: idn.form.idnID,
          contactText: eParty.FormattedName,
          contactEMail: eParty.EmailAddress,
          contactPhone: eParty.PhoneNumber || eParty.MobilePhoneNumber,
          shipToLocation: convAddress(shipToAddress).filter(Boolean).join(" "),
        },
        list: idn.list.map((item) => ({
          ...item,
          barcode: [idn.form.idnID, item.itemID].join("-"),
        })),
      };
      draft.response.body = { ...draft.response.body, poResult };
    }
  }
};
