module.exports = async (draft, context) => {
  const { fn, dayjs, odata, user, tryit, defined } = context;
  const { params } = draft.json.params;
  const { rootURL, username, password } = draft.json;
  try {
    const queryStringObj = fn.getPO_ItemParams(params, dayjs);
    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");

    const poItemCollection = "/bsg_purchaseorder/ItemCollection?";
    const odataParams = {
      url: [rootURL, poItemCollection, queryString].join(""),
      username,
      password,
    };

    const queryPO_Item = await fn
      .fetchAll(odata, odataParams)
      .then(({ result = [] }) => result);
    const queryPurchaseOrderItems = queryPO_Item.filter((poItem) => {
      return (
        !params.isSupplier ||
        (params.isSupplier && poItem.PO.SellerPartyID === user.id.toUpperCase())
      );
    });

    const poList = queryPurchaseOrderItems.reduce((acc, curr) => {
      if (!acc.includes(curr.PO.ID)) {
        acc.push(curr.PO.ID);
      }
      return acc;
    }, []);

    /**
     * conversion
     */

    const purchaseOrderItems = queryPurchaseOrderItems
      .filter((item) => item.ChargeDivision_KUT !== "103")
      .sort((valueA, valueB) => {
        if (valueB.StartDateTime === valueA.StartDateTime) {
          if (valueB.PO.ID === valueA.PO.ID) {
            return valueA.ID - valueB.ID;
          } else return valueA.PO.ID - valueB.PO.ID;
        } else
          return (
            Number(valueA.StartDateTime.replace(/^\/Date\(|\)\//g, "")) -
            Number(valueB.StartDateTime.replace(/^\/Date\(|\)\//g, ""))
          );
      })
      .map((item, idx) => {
        const po = item.PO || {};
        const scheduleLine = tryit(
          () =>
            item.PurchaseOrderItemScheduleLine.map((sl) => ({
              index: sl.ID,
              quantity: sl.Quantity,
              unitCodeText: sl.unitCodeText,
              date: fn.convDate(dayjs, sl.StartDateTime),
            })),
          []
        );
        const itemNote = convNote(defined(item.PurchaseOrderItemText, [])).find(
          (text) => text.typeCode === "10014"
        );
        const shipTo = item.PurchaseOrderShipToItemLocation || {};
        const shipToAddress = (shipTo.AddressSnapshotPostalAddress || [])[0];
        return {
          index: idx + 1,
          objectID: item.ObjectID,
          purchaseOrderID: po.ID,
          poItemNumber: item.ID,
          materialID: item.ProductID,
          materialText: item.FULL_NAME_KUT || item.Description,
          categoryID: item.ProductCategoryInternalID,
          supplier: po.SellerParty.PartyID,
          supplierText: po.SellerParty.FormattedName, // 공급처
          confirmIndicatior: po.POCONFIRM_KUT === "102",
          chargeDivision:
            (item.ChargeDivision_KUT === "103" && item.ChargeDivision_KUT) ||
            "",
          itemproductStandard: item.ProductStandard_KUT,
          productStandard: item.ProductStandard_KUT,
          manufacturer: item.Manufacturer_KUT,
          processType: "",
          supplyStatusText: item.PurchaseOrderDeliveryStatusCodeText,
          startDate: fn.convDate(dayjs, item.StartDateTime),
          orderSiteID: shipTo.LocationID,
          orderSite: shipTo.Name,
          orderSiteZIP: shipToAddress.StreetPostalCode,
          orderSiteAddress: [
            `${shipTo.Name} -`,
            shipToAddress.RegionCodeText,
            shipToAddress.CityName,
            shipToAddress.StreetName,
          ],
          orderQuantity: item.Quantity,
          // restQuantity,
          // scheduledQuantity,
          isScheduled: scheduleLine.length > 0,
          scheduleLine,
          deliveredQuantity: item.TotalDeliveredQuantity,
          // deliveryClose,
          unitPrice: item.ListUnitPriceAmount,
          currency: item.currencyCodeText,
          unit: item.unitCodeText,
          unitCode: item.unitCode,
          supplyAmount: item.NetAmount,
          taxAmount: item.TaxAmount,
          itemNote,
          purchaseOrderText: (itemNote || {}).text,
        };
      });

    draft.response.body = {
      params,
      po_url: odataParams.url,
      sample: queryPurchaseOrderItems[0],
      purchaseOrderItems,
      poList,
    };
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      params,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
  function convNote(arr = []) {
    return arr.map((text) => ({
      objectID: text.ObjectID,
      createdBy: text.CreatedBy,
      createdOn: fn.convDate(dayjs, text.CreatedOn),
      updatedOn: fn.convDate(dayjs, text.UpdatedOn),
      typeCode: text.TypeCode,
      typeCodeText: text.TypeCodeText,
      text: text.Text,
    }));
  }
};
