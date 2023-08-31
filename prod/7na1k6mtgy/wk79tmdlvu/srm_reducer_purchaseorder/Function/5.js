module.exports = async (draft, { lib, file }) => {
  const { defined } = lib;
  // if (draft.response.body.E_STATUS === "F") {
  //   return;
  // }
  const Quantity = {
    create: (qty, unit, text) => {
      return {
        number: qty,
        formattedNumber: qty.toLocaleString(),
        unit,
        text,
      };
    },
  };

  const convPO = (purchaseOrders) =>
    purchaseOrders.map((po, idx) => {
      const order = defined(po, {});
      const note = convNote(defined(order.texts, []));
      const extension = defined(order.extension, {});
      return {
        index: idx + 1,
        objectID: order.objectID,
        purchaseOrderID: order.id,
        orderDate: order.creationDate,
        orderStatus: order.status.lifeCycle.id,
        orderStatusText: order.status.lifeCycle.text,
        confirmIndicatior: extension.confirmIndicatior,
        confirmDate: extension.confirmDate,
        deliveryStatusText: order.status.delivery.text,
        contactText: order.party.employeeResponsible.text,
        contactPhone:
          order.party.employeeResponsible.phoneNumber ||
          order.party.employeeResponsible.mobileNumber,
        contactEMail: order.party.employeeResponsible.email,
        supplierAmount: order.totalNetAmount,
        taxAmount: order.totalTaxAmount,
        totalAmount: order.grossAmount,
        currency: order.currency.id,
        currencyText: order.currency.text,
        desc: note,
        textButton: !!note,
        company: order.party.billTo.id,
        companyText: order.party.billTo.text,
        supplier: order.party.seller.id,
        supplierText: order.party.seller.text,
        items: convPOItem(order),
      };
    });

  const convPOItem = (purchaseOrder) =>
    purchaseOrder.items.map((it) => {
      const item = defined(it, {});
      const orderQuantity = item.plannedQuantity.number;
      const deliveredQuantity = item.totalDeliveredQuantity.number;
      const scheduledQuantity = item.deliveryQyantity.number;
      const directMaterialIndicator = item.directMaterialIndicator;
      const thirdPartyDealIndicator = item.thirdPartyDealIndicator;
      let processType = "재고 조달";
      if (thirdPartyDealIndicator) {
        processType = "서드파티";
      } else if (!directMaterialIndicator) {
        processType = "비재고";
      }
      return {
        index: item.id,
        processType,
        directMaterialIndicator,
        thirdPartyDealIndicator,
        supplier: purchaseOrder.party.seller.id,
        supplierText: purchaseOrder.party.seller.text,
        contractStatusText: "",
        materialID: item.material.id,
        materialText: item.material.text,
        orderDate: item.orderDateTime,
        startDate: item.startDateTime,
        company: purchaseOrder.party.billTo.id,
        orderSiteID: item.shipToLocation.id,
        orderSite: item.shipToLocation.text,
        currency: item.currency.id,
        currencyText: item.currency.text,
        unit: item.unit.id,
        unitText: item.unit.text,
        unitPerCurrency: `${item.unit.text}/${item.currency.text}`,
        orderQuantity,
        restQuantity:
          Math.round(
            (orderQuantity - deliveredQuantity - scheduledQuantity) * 1000
          ) / 1000,
        scheduledQuantity,
        deliveredQuantity,
        unitPrice: item.listUnitPrice.amount,
        supplyAmount: Quantity.create(item.netAmount).formattedNumber,
        taxAmount: Quantity.create(item.taxAmount).formattedNumber,
        totalAmount: Number(item.netAmount) + Number(item.taxAmount),
        supplyStatusText: item.status.delivery.text,
        purchaseOrderText: convNote(item.texts),
        shipToLocation: convAddress(item.shipToLocation).join("\n"),
      };
    });

  const convAddress = (addressData) => {
    const data = defined(addressData, {});
    const name = data.text;
    const address = data.address;
    const regionText = address.region.text;
    const cityText = `${address.cityName} ${address.additionalCityName}`;
    const streetText = address.streetName;
    const postalCode = address.streetCode;
    return [name, regionText, cityText, streetText, postalCode];
  };

  const convNote = (notes) =>
    notes
      .filter((note) => note.type.id === "10014")
      .map((note) => note.text)
      .join(" ");

  const po = draft.response.body.formatted || [];
  const message = ["조회가 완료되었습니다"];
  if (draft.response.body.isLast === false) {
    message.push("더 조회할 내역이 있습니다");
  }
  draft.response.body = {
    ...draft.response.body,
    conversion: convPO(po),
    E_STATUS: "S",
    E_MESSAGE: message.filter(Boolean).join("\n"),
  };
  if (draft.json.resultUploadKey) {
    // const payloadString = JSON.stringify(draft.response.body);
    // const buf = Buffer.from(payloadString, "utf8").toString();
    const uploadResult = await file.upload(
      draft.json.resultUploadKey,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
  }
};
