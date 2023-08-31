module.exports = async (draft, { dayjs, lib, file }) => {
  const { tryit, defined, isArray, isObject } = lib;
  const purchaseOrder = draft.json.purchaseOrder;
  const idn = draft.json.idn || [];
  const gsa = draft.json.gsa || [];
  const reqPath = draft.json.reqPath;

  if (purchaseOrder.length === 0) {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = "해당 오더가 없습니다.";
    draft.response.body.conversion = [];
    if (draft.json.resultUploadKey) {
      const uploadResult = await file.upload(
        draft.json.resultUploadKey,
        draft.response.body
      );
      draft.response.body = { ...draft.response.body, uploadResult };
    }
    return;
  } else {
    try {
      const message = ["조회가 완료되었습니다"];
      if (draft.response.body.isLast === false) {
        message.push("더 조회할 내역이 있습니다");
      }
      draft.response.body = {
        ...draft.response.body,
        conversion: convPO(purchaseOrder),
        E_STATUS: "S",
        E_MESSAGE: message.filter(Boolean).join("\n"),
      };
    } catch (error) {
      draft.response.body = {
        ...draft.response.body,
        conversion: [],
        E_STATUS: "S",
        E_MESSAGE: error.message,
      };
    }
    if (draft.json.resultUploadKey) {
      const uploadResult = await file.upload(
        draft.json.resultUploadKey,
        draft.response.body
      );
      draft.response.body = { ...draft.response.body, uploadResult };
    }
  }

  function convPO(purchaseOrders) {
    return purchaseOrders.map((po, idx) => {
      const order = defined(po, {});
      const items = convPOItem(order);
      const orderSiteList = items
        .reduce((acc, curr) => {
          const { orderSiteID, orderSite, shipToLocation } = curr;
          if (!acc.find((site) => site.orderSiteID === orderSiteID)) {
            const { streetCode, region, cityName, streetName } = shipToLocation;
            const regionText = (region || {}).text;
            acc.push({
              orderSiteID,
              orderSite,
              shipToLocation,
              orderSiteAddress: [
                `${orderSite}: (${streetCode})`,
                regionText,
                cityName,
                streetName,
              ],
            });
          }
          return acc;
        }, [])
        .sort((al, be) => al.orderSiteID - be.orderSiteID);
      const note = convNote(defined(order.PurchaseOrderText, []).map(convText));
      const seller = convParty(order.SellerParty, "Seller");
      const billTo = convParty(order.BillToParty, "BillTo");
      const employeeResponsible = convParty(
        order.EmployeeResponsibleParty,
        "EmployeeResponsible"
      );
      return {
        index: idx + 1,
        objectID: order.ObjectID,
        purchaseOrderID: order.ID, // 번호
        orderDate: convDate(dayjs, order.CreationDate), // 생성일,
        orderStatus: order.PurchaseOrderLifeCycleStatusCode,
        orderStatusText: order.PurchaseOrderLifeCycleStatusCodeText,
        orderSiteList,
        orderSite: orderSiteList.map((site) => site.orderSite),
        orderSiteAddress: orderSiteList.map((site) =>
          site.orderSiteAddress.join(" ")
        ),
        confirmIndicatior: order.SRM001_KUT,
        confirmDate: convDate(dayjs, order.SRM002_KUT),
        deliveryStatusText: order.PurchaseOrderDeliveryStatusCodeText,
        contactText: employeeResponsible.text,
        contactPhone:
          employeeResponsible.phoneNumber || employeeResponsible.mobileNumber,
        contactEMail: employeeResponsible.email,
        supplierAmount: order.TotalNetAmount, // 공급가액
        taxAmount: order.TotalTaxAmount, // 부가세
        totalAmount: order.GrossAmount, // 합계금액
        currency: order.currencyCode,
        currencyText: order.currencyCodeText,
        desc: note,
        textButton: !!note,
        company: billTo.id,
        companyText: billTo.text,
        supplier: seller.id,
        supplierText: seller.text,
        supplierAddress: [
          [seller.postalAddress.region.text, seller.postalAddress.cityName]
            .filter(Boolean)
            .join(" "),
          seller.postalAddress.streetName,
        ],
        items,
      };
    });
  }

  function convPOItem(purchaseOrder) {
    const purchaseOrderItem =
      reqPath === "/byd_po_detail" ? purchaseOrder.Item : [];
    const Quantity = {
      create: (qty, unit, text) => {
        const formattedNumber = qty.toLocaleString();
        return { number: Number(qty), formattedNumber, unit, text };
      },
    };
    return purchaseOrderItem.map((it) => {
      const item = defined(it, {});
      const seller = convParty(purchaseOrder.SellerParty, "Seller");
      const billTo = convParty(purchaseOrder.BillToParty, "BillTo");
      const ShipToLocation = tryit(() => item.ItemShipToAddress, {});
      const shipToLocation = convAddress(ShipToLocation, "ItemShipTo");
      const itemText = tryit(() => item.PurchaseOrderItemText, []);
      const directMaterialIndicator = item.DirectMaterialIndicator;
      const thirdPartyDealIndicator = item.ThirdPartyDealIndicator;
      let processType = "재고 조달";
      if (thirdPartyDealIndicator) {
        processType = "서드파티";
      } else if (!directMaterialIndicator) {
        processType = "비재고";
      }
      const purchaseOrderID = purchaseOrder.ID;
      const idnQtys = getIDN_Quantity({ item, purchaseOrderID, idn, gsa });
      const orderQuantity = Quantity.create(
        item.Quantity,
        item.unitCode,
        item.unitCodeText
      ).number;
      const deliveredQuantity = Quantity.create(
        item.TotalDeliveredQuantity,
        item.TotalDeliveredQuantityUnitCode,
        item.TotalDeliveredQuantityUnitCodeText
      ).number;
      const scheduledQuantity = Quantity.create(
        idnQtys.delivery,
        item.unitCode,
        item.unitCodeText
      ).number;

      return {
        objectID: item.ObjectID,
        index: item.ID,
        processType,
        directMaterialIndicator,
        thirdPartyDealIndicator,
        supplier: seller.id,
        supplierText: seller.text,
        contractStatusText: "",
        materialID: item.ProductID,
        materialText: item.Description,
        orderDate: convDate(dayjs, item.OrderedDateTime), // 납품요청일
        startDate: convDate(dayjs, item.StartDateTime),
        company: billTo.id,
        orderSiteID: item.ShipToLocationID,
        orderSite: ShipToLocation.FormattedName, // 납품장소
        currency: item.currencyCode,
        currencyText: item.currencyCodeText,
        unit: item.unitCode,
        unitText: item.unitCodeText,
        unitPerCurrency: `${item.unitCodeText}/${item.currencyCodeText}`,
        orderQuantity,
        restQuantity:
          Math.round(
            (orderQuantity - deliveredQuantity - scheduledQuantity) * 1000
          ) / 1000,
        scheduledQuantity,
        deliveredQuantity,
        unitPrice: Number(item.ListUnitPriceAmount),
        supplyAmount: Quantity.create(item.NetAmount).formattedNumber,
        taxAmount: Quantity.create(item.TaxAmount).formattedNumber,
        totalAmount: Number(item.NetAmount) + Number(item.TaxAmount),
        supplyStatusText: item.PurchaseOrderDeliveryStatusCodeText,
        purchaseOrderText: convNote(itemText.map(convText)),
        shipToLocation,
        address: ((address, name) => {
          const regionText = address.region.text;
          const cityText = [address.cityName, address.additionalCityName]
            .filter(Boolean)
            .join(" ");
          const streetText = address.streetName;
          const postalCode = address.streetCode;
          return [name, regionText, cityText, streetText, postalCode]
            .filter(Boolean)
            .join(" ");
        })(shipToLocation, ShipToLocation.FormattedName),
      };
    });
  }

  function getNestedProp(propName, obj) {
    if (!obj) {
      return undefined;
    }
    let value = obj[propName];
    if (value) {
      return value;
    } else {
      if (isObject(obj)) {
        Object.keys(obj).some((key) => {
          if (isArray(obj[key])) {
            return obj[key].some((sub) => {
              value = getNestedProp(propName, sub);
              return value;
            });
          } else if (isObject(obj[key])) {
            value = getNestedProp(propName, obj[key]);
            return value;
          }
          return false;
        });
      } else if (isArray(obj)) {
        return obj[propName].some((sub) => {
          value = getNestedProp(propName, sub);
          return value;
        });
      }
      return value;
    }
  }

  function convParty(party, string, options = {}) {
    const { version } = options;
    const _party = defined(party, {});
    const contactParty = defined(_party[`${string}ContactParty`], {});
    return {
      id: _party.PartyID,
      phoneNumber: getNestedProp("PhoneNumber", _party),
      mobileNumber: getNestedProp("MobilePhoneNumber", _party),
      contactParty: {
        id: _party.ContactPartyID,
        text: contactParty.FormattedName,
        phoneNumber: contactParty.PhoneNumber,
        mobileNumber: contactParty.MobilePhoneNumber,
        facsimile: contactParty.Facsimile,
      },
      text: getNestedProp("FormattedName", _party),
      postalAddress:
        version === "v2"
          ? convAddress(
              defined(getNestedProp(`${string}Address`, _party), _party),
              `${string}Party`,
              options
            )
          : convAddress(_party, `${string}Party`),
      email: _party.EmailAddress,
    };
  }
  function convAddress(path, string, options = {}) {
    const { version } = options;
    const postalAddress =
      version === "v2"
        ? tryit(() => {
            return defined(
              path[`${string}PostalAddress`][0],
              path[`${string}PostalAddress`]
            );
          }, {})
        : tryit(() => {
            return path[`${string}PostalAddress`][0] || {};
          }, {});
    return {
      region: {
        id: postalAddress.RegionCode,
        text: postalAddress.RegionCodeText,
      },
      country: {
        id: postalAddress.CountryCode,
        text: postalAddress.CountryCodeText,
      },
      cityName: postalAddress.CityName,
      additionalCityName: postalAddress.AdditionalCityName,
      streetName: postalAddress.StreetName,
      streetCode: postalAddress.StreetPostalCode,
    };
  }
  function convText(text) {
    return {
      objectID: text.ObjectID,
      text: text.Text,
      language: {
        id: text.LanguageCode,
        text: text.LanguageCodeText,
      },
      type: {
        id: text.TypeCode,
        text: text.TypeCodeText,
      },
      author: {
        uuid: text.AuthorUUID,
        name: text.AuthorName,
      },
      createDate: convDate(dayjs, text.CreatedOn),
      createdBy: text.CreatedBy,
      updatedDate: convDate(dayjs, text.UpdatedOn),
      lastUpdatedBy: text.LastUpdatedBy,
    };
  }
  function convNote(notes = []) {
    return notes
      .filter((note) => note.type.id === "10014")
      .map((note) => note.text)
      .join(" ");
  }
  function getIDN_Quantity({ item, purchaseOrderID, idn, gsa }) {
    const refItem = item.DirectMaterialIndicator ? idn : gsa;
    const fItem = refItem.filter(
      (it) =>
        it.ID === purchaseOrderID &&
        it.ItemID === item.ID &&
        it.TypeCode === "001"
    );
    switch (item.DirectMaterialIndicator) {
      case true: {
        // 재고조달
        return fItem.reduce(
          (acc, curr) => {
            const idnObj = curr.InboundDelivery;
            const rCode = idnObj.ReleaseStatusCode;
            const dPCode = idnObj.DeliveryProcessingStatusCode;
            const cCode = idnObj.CancellationStatusCode;
            const qtyObj = curr.Item.DeliveryQuantity;
            if (cCode === "1") {
              if (rCode === "3" && ["2", "3"].includes(dPCode)) {
                acc.delivered = Number(qtyObj.Quantity) + acc.delivered;
              }
              if (rCode === "3" && dPCode === "1") {
                acc.delivery = Number(qtyObj.Quantity) + acc.delivery;
              }
              if (rCode === "1" && dPCode === "1") {
                acc.delivery = Number(qtyObj.Quantity) + acc.delivery;
              }
            }
            return acc;
          },
          { delivery: 0, delivered: 0 }
        );
      }
      case false: {
        // 비자재
        return fItem.reduce(
          (acc, curr) => {
            const quantity = curr.Item.Quantity || 0;
            if (curr.GSA.ReleaseStatusCode === "1") {
              acc.delivery = Number(quantity) + acc.delivery;
            }
            if (curr.GSA.ReleaseStatusCode === "3") {
              acc.delivered = Number(quantity) + acc.delivered;
            }
            return acc;
          },
          { delivery: 0, delivered: 0 }
        );
      }
      default:
        return { delivery: 0, delivered: 0 };
    }
  }
};

function convDate(dayjs, dateStr, format = "YYYY-MM-DD") {
  if (!dateStr) {
    return "";
  }
  let date;
  if (typeof dateStr === "string") {
    if (/^\d{1,}$/.test(dateStr)) {
      date = dateStr;
    } else {
      const numberString = dateStr.replace(/^\/Date\(/, "").replace(")/", "");
      if (/^\d{1,}$/.test(numberString)) {
        date = new Date(parseInt(numberString, 10));
      } else date = numberString;
    }
  }
  return dayjs(date).format(format);
}
