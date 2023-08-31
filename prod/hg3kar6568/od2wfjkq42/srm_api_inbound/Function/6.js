module.exports = async (draft, { lib, odata, file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  const conversion = draft.json.conversion;
  let po;
  try {
    const { tryit, defined } = lib;
    const { searchType } = draft.json.params;
    po = defined(
      tryit(() => conversion[0].form.po[0].purchaseOrderID),
      ""
    );
    if (searchType === "detail" && po) {
      const expand = [
        // "SellerParty/SellerPartyDisplayName",
        "SellerParty/SellerPartyPostalAddress",
        "EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
        // "PurchaseOrderText",
        // "Item/Material",
        // "Item/PurchaseOrderItemScheduleLine",
        "Item/PurchaseOrderReceivingItemSite",
        "Item/ItemShipToAddress/ItemShipToPostalAddress",
        // "Item/PurchaseOrderItemText",
        // "BillToParty/BillToPartyDisplayName",
        // "BillToParty/BillToPartyPostalAddress",
      ].join(",");
      const queryParameters = [
        `$expand=${expand}`,
        `$filter=(ID eq '${po}')`,
        "$inlinecount=allpages",
        "$format=json",
      ];
      const queryString = queryParameters.join("&");
      const url = draft.json.odataURL;
      const odataService = [url, "bsg_purchaseorder/POCollection"].join("");
      const poURL = [odataService, queryString].join("?");
      draft.response.body.poURL = poURL;
      const username = draft.json.username;
      const password = draft.json.password;
      const poResult = await odata.get({
        url: poURL,
        username,
        password,
      });
      const purchaseOrder = defined(
        tryit(() => poResult.d.results[0]),
        {}
      );
      draft.response.body.purchaseOrder = purchaseOrder;
      const seller = defined(
        tryit(() => purchaseOrder.SellerParty),
        {}
      );
      const sellerAddress = defined(
        tryit(() => seller.SellerPartyPostalAddress[0]),
        {}
      );
      const employee = defined(
        tryit(() => purchaseOrder.EmployeeResponsibleParty),
        {}
      );
      const shipTo = defined(
        tryit(() => purchaseOrder.Item[0].ItemShipToAddress),
        {}
      );
      const shipToAddress = defined(
        tryit(() => shipTo.ItemShipToPostalAddress[0]),
        {}
      );
      const shipToLocation = ((address, name) => {
        const regionText = address.RegionCodeText;
        const cityText = [address.CityName, address.AdditionalCityName]
          .filter(Boolean)
          .join(" ");
        const streetText = address.StreetName;
        const postalCode = address.StreetPostalCode;
        return [name, regionText, cityText, streetText, postalCode]
          .filter(Boolean)
          .join(" ");
      })(shipToAddress, shipTo.FormattedName);
      const contactText = employee.FormattedName;
      const contactEMail = employee.EmailAddress;
      const contactPhone = employee.PhoneNumber || employee.MobilePhoneNumber;
      conversion[0].form = {
        ...conversion[0].form,
        shipToLocation,
        contactText,
        contactEMail,
        contactPhone,
        supplier: seller.PartyID,
        supplierText: seller.FormattedName,
        supplierAddress: [
          [sellerAddress.RegionCodeText, sellerAddress.CityName].join(" "),
          sellerAddress.StreetName,
        ],
        sellerAddress,
      };
    }
    if (resultUploadKey) {
      await file.upload(resultUploadKey, {
        ...draft.response.body,
        conversion: conversion
          .filter((item) => item.idnID || (item.form && item.form.idnID))
          .sort(function (al, be) {
            if (al.creationDate === be.creationDate) {
              return -1 * al.idnID.localeCompare(be.idnID);
            }
            return new Date(be.creationDate) - new Date(al.creationDate);
          })
          .map((it, idx) => ({ ...it, index: idx + 1 })),
        E_STATUS: "S",
        E_MESSAGE: "조회가 완료되었습니다",
      });
    }
  } catch (error) {
    draft.response.body.fn6Msg = error.message;
    if (resultUploadKey) {
      await file.upload(resultUploadKey, {
        ...draft.response.body,
        E_STATUS: "S",
        E_MESSAGE: "",
      });
    }
  }
};
