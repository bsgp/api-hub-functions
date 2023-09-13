module.exports = async (draft, { request, odata }) => {
  const { url, username, password } = draft.json;

  const {
    confirmIndicatior,
    deliveryStatus,
    materialID,
    orderDateFrom,
    orderDateTo,
    purchaseOrderID,
    startDateFrom,
    startDateTo,
    supplierID,
    shipToLocationID,
  } = request.body;

  const expand = [
    "PO",
    "PO/SellerParty,PurchaseOrderItemText",
    "PO/BillToParty",
    "PurchaseOrderShipToItemLocation",
  ].join(",");

  const filter = [];

  if (confirmIndicatior) {
    filter.push(`PO/SRM001_KUT eq '${confirmIndicatior}'`);
  }
  if (deliveryStatus) {
    filter.push(`PurchaseOrderDeliveryStatusCode eq '${deliveryStatus}'`);
  }
  if (materialID) {
    filter.push(`ProductID eq '${materialID}'`);
  }
  if (orderDateFrom && orderDateTo) {
    filter.push(
      [
        `PO/CreationDate ge datetimeoffset'${orderDateFrom}T00:00:00Z'`,
        `PO/CreationDate le datetimeoffset'${orderDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (purchaseOrderID) {
    filter.push(`PO/ID eq '${purchaseOrderID}'`);
  }
  if (startDateFrom && startDateTo) {
    filter.push(
      [
        `StartDateTime ge datetimeoffset'${startDateFrom}T00:00:00Z'`,
        `StartDateTime le datetimeoffset'${startDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (supplierID) {
    filter.push(`PO/SellerPartyID eq '${supplierID}'`);
  }
  if (shipToLocationID) {
    filter.push(`ShipToLocationID eq '${shipToLocationID}'`);
  }

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`,
    "$top=200",
    "$inlinecount=allpages",
    "$format=json",
  ];

  const odataService = [url, "bsg_purchaseorder/ItemCollection"].join("/");
  const queryString = queryParameters.join("&");
  const odataURL = [odataService, queryString].join("?");

  const queryResult = await odata.get({
    url: odataURL,
    username,
    password,
  });

  const purchaseOrderItemResults = queryResult.d.results;

  const conversion = await Promise.all(
    purchaseOrderItemResults.map(async (item, idx) => {
      const {
        delivery: scheduledQuantity,
        cancel: returnQuantity,
        idnResults: idn,
      } = await getQuantity(item);

      const note = item.PurchaseOrderItemText.map((item) => item.Text);

      return {
        index: idx + 1,
        isScheduled: convDate(item.PO.SRM002_KUT),
        //ThirdPartyDealIndicator: item.ThirdPartyDealIndicator,
        confirmIndicatior: item.PO.SRM001_KUT,
        //deliveryStatusText: item.PurchaseOrderDeliveryStatusCodeText,
        supplyStatusText: item.PurchaseOrderDeliveryStatusCodeText,
        materialID: item.ProductID,
        materialText: item.Description,
        poItemNumber: item.ID,
        purchaseOrderID: item.PO.ID,
        orderSite: item.PurchaseOrderShipToItemLocation.Name,
        //item.ShipToLocationID,
        startDate: convDate(item.StartDateTime),
        supplierText: item.PO.SellerParty.FormattedName,
        //supplyStatusText: item.PO.SellerParty.FormattedName,
        unitPrice: item.ListUnitPriceAmount, //item.Amount,
        manufacturer: item.PO.BillToParty.FormattedName,
        //itemproductStandard:
        supplyAmount: item.NetAmount,
        unit: item.BaseQuantityUnitCode,
        currency: item.currencyCode,
        orderQuantity: item.Quantity, //발주수량
        deliveredQuantity: item.TotalDeliveredQuantity, //입고수량
        idnQuantity: scheduledQuantity, //납품예정수량
        restQuantity:
          Math.round(
            (item.Quantity - item.TotalDeliveredQuantity - scheduledQuantity) *
              1000
          ) / 1000,

        returnQuantity: returnQuantity, //반품수량
        itemDesc: note, //비고
        idn,
      };
    })
  );

  draft.response.body = {
    odataURL,
    purchaseOrderItems: conversion,
    purchaseOrderItemResults,
  };

  function convDate(startDate) {
    const numberString = startDate.replace(/^\/Date\(/, "").replace(")/", "");
    const date = new Date(parseInt(numberString, 10));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 06
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = year + "-" + month + "-" + day;
    return dateString;
  }

  async function getQuantity(itemData) {
    let service, expand;
    if (!itemData.DirectMaterialIndicator) {
      //비자재
      service = [url, "bsg_gsa/PurchaseOrderItemReferenceCollection"].join("/");
      expand = "Item,GSA";
    } else {
      //자재
      service = [url, "bsg_inbound_notify/ItemDocPOCollection"].join("/");
      expand = "Item,Item/DeliveryQuantity,InboundDelivery";
    }
    const query =
      `&$expand=${expand}` +
      `&$filter=(Item/ProductID eq '${itemData.ProductID}')` +
      `and(ID eq '${itemData.PO.ID}')` +
      `and(ItemID eq '${itemData.ID}')` +
      `&$format=json`;

    const quaOdataURL = [service, query].join("?");

    const result = await odata.get({
      url: quaOdataURL,
      username,
      password,
    });
    const idnResults = result.d.results;

    let quantityResult;

    if (!itemData.DirectMaterialIndicator) {
      //비자재
      quantityResult = idnResults.reduce(
        (acc, curr) => {
          const quantity = curr.Item.Quantity || 0;
          if (curr.GSA.ReleaseStatusCode === "1") {
            acc.delivery += Number(quantity);
          }
          return acc;
        },
        { delivery: 0, cancel: 0 }
      );
    } else {
      //자재
      quantityResult = idnResults.reduce(
        (acc, curr) => {
          const idnObj = curr.InboundDelivery;
          const cCode = idnObj.CancellationStatusCode;
          const dPCode = idnObj.DeliveryProcessingStatusCode;
          const qtyObj = curr.Item.DeliveryQuantity;
          if (cCode === "1") {
            //Not Canceled
            if (dPCode === "1") {
              //Not started
              acc.delivery += Number(qtyObj.Quantity);
            }
          } else {
            acc.cancel += Number(qtyObj.Quantity);
          }
          return acc;
        },
        { delivery: 0, cancel: 0 }
      );
    }
    return {
      delivery: quantityResult.delivery,
      cancel: quantityResult.cancel,
      idnResults: idnResults,
    };
  }
};
