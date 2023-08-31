module.exports = async (draft, context) => {
  const { fn, dayjs, env, odata, user, defined, tryit } = context;
  try {
    const baseURL = env.BYD_URL;
    const username = env.BYD_ID;
    const password = env.BYD_PASSWORD;
    const params = draft.json.params;

    const queryStringObj = fn.getPurchaseOrderParams(params, dayjs);
    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");
    const service = [
      "/sap/byd/odata/cust/v1",
      "bsg_purchaseorder/POCollection?",
    ].join("/");
    const po_url = [baseURL, service, queryString].join("");

    const queryPO = await fn
      .fetchAll(odata, { url: po_url, username, password })
      .then(({ result = [] }) => result);
    const queryPurchaseOrders = queryPO.filter((po) => {
      const userID = `${user.id}`;
      return (
        !params.isSupplier ||
        (params.isSupplier && po.SellerParty.PartyID === userID.toUpperCase())
      );
    });

    draft.response.body.po_url = po_url;
    draft.response.body.queryPurchaseOrders = queryPurchaseOrders;
    if (queryPO.length === 0) {
      draft.response.body = {
        ...draft.response.body,
        E_STATUS: "S",
        E_MESSAGE: "해당하는 오더가\n없습니다",
        purchaseOrder: [],
      };
      return;
    }
    if (queryPurchaseOrders.length === 0) {
      draft.response.body = {
        ...draft.response.body,
        E_STATUS: "S",
        E_MESSAGE: "해당 오더에\n권한이 없습니다",
        purchaseOrder: [],
      };
      return;
    }

    const idn_service = [
      "/sap/byd/odata/ana_businessanalytics_analytics.svc",
      "RPZ5658043746D8DCE1C4FE7EQueryResults?",
    ].join("/");
    const idn_queryStringObj = fn.getIDN_Params(params);
    const idn_queryString = Object.keys(idn_queryStringObj)
      .map((key) => `${key}=${idn_queryStringObj[key]}`)
      .join("&");
    const idn_url = [baseURL, idn_service, idn_queryString].join("");

    const queryIDN = await fn
      .fetchAll(odata, { url: idn_url, username, password })
      .then(({ result = [] }) => result);

    draft.response.body.idn_url = idn_url;
    draft.response.body.queryIDN = queryIDN;
    draft.response.body.purchaseOrder = queryPurchaseOrders.map((po, idx) => {
      const order = defined(po, {});
      const items = convItem(order, queryIDN);
      const orderSiteList = items
        .reduce((acc, curr) => {
          const { orderSiteID, orderSite, orderSiteZIP, orderSiteAddress } =
            curr;
          if (!acc.find((site) => site.orderSiteID === orderSiteID)) {
            acc.push({
              orderSiteID,
              orderSite,
              orderSiteZIP,
              orderSiteAddress,
            });
          }
          return acc;
        }, [])
        .sort((al, be) => al.orderSiteID - be.orderSiteID);
      const sellerAddress =
        tryit(() => po.SellerParty.SellerPartyPostalAddress[0]) || {};
      const note = convNote(defined(order.PurchaseOrderText, []));

      return {
        index: idx + 1,
        objectID: order.ObjectID,
        purchaseOrderID: order.ID, // 번호
        orderDate: fn.convDate(dayjs, order.CreationDate, "YYYY-MM-DD HH:mm"),
        orderStatus: order.PurchaseOrderLifeCycleStatusCode,
        orderStatusText: order.PurchaseOrderLifeCycleStatusCodeText,
        confirmIndicatior: order.POCONFIRM_KUT === "102",
        confirmDate: fn.convDate(dayjs, order.CONFIRMDATE_KUT),
        orderSiteID: orderSiteList[0].orderSiteID,
        orderSite: orderSiteList.map((site) => site.orderSite),
        orderSiteZIP: orderSiteList.map((site) => site.orderSiteZIP),
        orderSiteAddress: orderSiteList.map((site) =>
          site.orderSiteAddress.join(" ")
        ),
        deliveryStatusText: order.PurchaseOrderDeliveryStatusCodeText,
        contactText: order.EmployeeResponsibleParty.FormattedName,
        contactPhone:
          order.EmployeeResponsibleParty.PhoneNumber ||
          order.EmployeeResponsibleParty.MobilePhoneNumber,
        recipientPhone: order.EmployeeResponsibleParty.PhoneNumber,
        recipientMobile: order.EmployeeResponsibleParty.MobilePhoneNumber,
        contactEMail: order.EmployeeResponsibleParty.EmailAddress,
        supplierAmount: order.TotalNetAmount, // 공급가액
        taxAmount: order.TotalTaxAmount, // 부가세
        totalAmount: order.GrossAmount, // 합계금액
        currency: order.currencyCode,
        currencyText: order.currencyCodeText,
        note,
        desc: note[0] && note[0].text,
        textButton: !!note[0],
        company: order.BillToParty.PartyID,
        companyText: order.BillToParty.FormattedName,
        supplier: po.SellerParty.PartyID,
        supplierText: po.SellerParty.FormattedName, // 공급처
        SupplierPhone:
          po.SellerParty.PhoneNumber || po.SellerParty.MobilePhoneNumber,
        SupplierZIP: sellerAddress.StreetPostalCode,
        supplierAddress: [
          sellerAddress.RegionCodeText,
          sellerAddress.CityName,
          sellerAddress.StreetName,
        ],
        items,
      };
    });
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: ["Error Occurred", error.message].join(": "),
      user,
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

  function convItem(po = {}, idn = []) {
    return (po.Item || []).map((item) => {
      const fIDN_Item = idn.find(
        (idn) => idn.CPO_UUID === po.ID && idn.CPO_ITM_UUID === item.ID
      );
      let returnQuantity = 0;
      let scheduledQuantity = 0;
      let deliveryClose = false;
      if (fIDN_Item) {
        const cancelStatus = Number(fIDN_Item.CDEL_CANCELLATION_STATUS);
        const releaseStatus = Number(fIDN_Item.CDEL_NOTIF_STAT);
        const idnStatus = Number(fIDN_Item.CDEL_RELEASE_STATUS);
        deliveryClose = fIDN_Item.Cs1ANsB90CDEA3661B110;
        if (cancelStatus === 1 && releaseStatus === 3 && idnStatus === 2) {
          // 반품수량
          const returnQty = -(
            Number(item.TotalDeliveredQuantity) - Number(fIDN_Item.KCDEL_QTY)
          );
          returnQuantity = Math.round(returnQty * 1000) / 1000;
        }
        if (cancelStatus === 1 && releaseStatus === 1 && idnStatus === 1) {
          // 납품통지 수량
          scheduledQuantity = Number(fIDN_Item.KCDEL_QTY);
        }
      }
      const restQuantity =
        Math.round(
          (Number(item.Quantity) -
            Number(scheduledQuantity) -
            Number(item.TotalDeliveredQuantity) +
            Number(returnQuantity)) *
            1000
        ) / 1000;

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
        index: item.ID,
        objectID: item.ObjectID,
        materialID: item.ProductID,
        materialText: item.FULL_NAME_KUT || item.Description,
        categoryID: item.ProductCategoryInternalID,
        supplier: po.SellerParty.PartyID,
        supplierText: po.SellerParty.FormattedName, // 공급처
        chargeDivision:
          (item.ChargeDivision_KUT === "103" && item.ChargeDivision_KUT) || "",
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
        restQuantity,
        scheduledQuantity,
        scheduleLine,
        deliveredQuantity: item.TotalDeliveredQuantity,
        deliveryClose,
        unitPrice: item.ListUnitPriceAmount,
        currency: item.currencyCodeText,
        unit: item.unitCodeText,
        unitCode: item.unitCode,
        supplyAmount: item.NetAmount,
        taxAmount: item.TaxAmount,
        totalAmount: Number(item.NetAmount) + Number(item.TaxAmount),
        itemNote,
        purchaseOrderText: (itemNote || {}).text,
        attachment1: (
          (item.PurchaseOrderItemAttachmentFolder || []).find(
            (attach) => attach.CategoryCode === "3"
          ) || {}
        ).LinkWebURI,
        attachment2: item.EXT1_KUT,
        attachment3: item.EXT2_KUT,
      };
    });
  }
};
