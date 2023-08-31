// conversion to XML
module.exports = async (draft, { lib, sql }) => {
  const { tryit } = lib;
  // get Seqence Number from Ihub for InterchangeCtrlNbr
  const tables = draft.pipe.json.tables;

  const root = draft.pipe.json.Invoices;
  const ci = (root.CustomerInvoice || []).filter(
    (ci) =>
      ci.ProcessingTypeCode === "CI" && ci.CancellationInvoiceIndicator !== true
  );
  const customer = draft.pipe.json.customer;
  const material = draft.pipe.json.material;
  const soData = draft.pipe.json.soData;
  const odData = draft.pipe.json.odData;
  const TargetCustomer = draft.pipe.json.targetCustomer;
  const ChangeGLNCustomer = draft.pipe.json.changeGLNCustomer;
  const ExceptTxCode = draft.pipe.json.exceptTxCode;
  const MorrisonTxCode = draft.pipe.json.morrisonTxCode;

  const isExist = draft.pipe.json.isExist;
  if (!isExist) {
    return;
  }

  function getFormatDate(date) {
    const year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    const yyyymmdd = year + "" + month + "" + day;
    return yyyymmdd.slice(-6);
  }

  const convXML = (obj) => {
    const keys = Object.keys(obj);
    return keys
      .map((key) => {
        if (obj[key]) {
          if (typeof obj[key] === "string" || typeof obj[key] === "number") {
            return obj[key] && `<${key}>${obj[key]}</${key}>`;
          }
          if (Array.isArray(obj[key])) {
            const convArr = obj[key].map((item) => convXML(item)).join("");
            return `<${key}>${convArr}</${key}>`;
          }
          return `<${key}>${convXML(obj[key])}</${key}>`;
        }
        return "";
      })
      .join("");
  };

  const getData = (type, prop) => {
    const strSeparater = (arr) => {
      const fstr = arr.join(" ");
      const fLength = fstr.length;
      if (fLength > 0) {
        const strings = [];
        while (strings.join(" ").length < fLength / 2) {
          strings.push(arr[0]);
          arr.shift();
        }
        return [strings.join(" "), arr.join(" ")];
      } else return [" ", " "];
    };
    try {
      switch (type) {
        case "STANDARD_ID":
          return prop.StandardID["0"]._value_1;
        case "NAME":
          return prop.Address.FirstLineName.substr(0, 34);
        case "QTY_TYPE":
          return prop.Quantity.TypeCode._value_1;
        case "QTY":
          return prop.Quantity.Quantity._value_1;
        case "ID":
          return prop.ID._value_1;
        case "Description":
          return prop.Description._value_1
            .replace(/ {2}/g, "")
            .substring(0, 40);
        case "PostalAddress":
          return [
            [
              prop.Address.PostalAddress.CountryCode,
              prop.Address.PostalAddress.CityName,
            ].join(" "),
            prop.Address.PostalAddress.StreetPostalCode,
            ...strSeparater(
              [
                prop.Address.PostalAddress.StreetPrefixName,
                prop.Address.PostalAddress.StreetName,
              ]
                .join(" ")
                .split(" ")
            ),
          ];
        default:
          break;
      }
    } catch (error) {
      return "";
    }
  };

  const getDate = (dateStr) => {
    const dateJSON = new Date(Number(dateStr.match(/([0-9])\w+/g))).toJSON();
    return [
      dateJSON.substring(2, 4),
      dateJSON.substring(5, 7),
      dateJSON.substring(8, 10),
    ].join("");
  };

  const iArr = [];

  for (let idx = 0; idx < ci.length; idx++) {
    const invoice = ci[idx];
    const invoiceType = invoice.ProcessingTypeCode;
    const itemCommon = invoice.Item["0"];
    const seller = invoice.SellerParty;
    const buyer = invoice.BuyerParty;
    const billTo = invoice.BillToParty;
    const recipient = itemCommon.ProductRecipientParty;
    const buyerID = buyer.PartyID._value_1;
    const SubTotItemAmt_LVLA = { S: 0, P: 0, Z: 0 };
    const ExtSubTotItemAmt_EVLA = { S: 0, P: 0, Z: 0 };
    const ExtSubTotAmtIncDisc_ASDA = { S: 0, P: 0, Z: 0 };
    const VATAmt_VATA = { S: 0, P: 0, Z: 0 };
    const PayableSubTotAmtIncDisc_APSI = { S: 0, P: 0, Z: 0 };
    const TOTAL_AMOUNT_CODE = {
      ExtSubTotItemAmt_EVLA,
      VATAmt_VATA,
      SubTotItemAmt_LVLA,
      ExtSubTotAmtIncDisc_ASDA,
      PayableSubTotAmtIncDisc_APSI,
    };

    // 대상 고객만 송장 처리
    if (
      !TargetCustomer.includes(buyerID) ||
      buyer.StandardID["0"] === undefined
    ) {
      continue;
    }

    const buyerStandardID = getData("STANDARD_ID", buyer);
    let customerID = invoice.EXT019; // SFTP: FileHeader/customerID
    if (!customerID) {
      const fCustomer =
        customer.find((data) => data.CBP_UUID === buyerID) || {};
      customerID = fCustomer.CGLN_ID;
    }

    // 취소여부 태그 존재 확인(true면 취소송장 아님)
    const FileVerNbr = invoice.CancellationInvoiceIndicator ? "2" : "1";
    const adminData = invoice.SystemAdministrativeData;
    const FileCreateDate = adminData.LastChangeDateTime.replace(
      /-/g,
      ""
    ).substr(2, 6);

    const LG_GLN = ChangeGLNCustomer.includes(buyerID)
      ? "5065004854009"
      : getData("STANDARD_ID", seller);

    // OPTIONAL
    const TxCode = ExceptTxCode.includes(buyerID)
      ? ""
      : MorrisonTxCode.includes(buyerID)
      ? "380"
      : "0700";
    const TxType =
      !ExceptTxCode.includes(buyerID) && MorrisonTxCode.includes(buyerID)
        ? "MRCHI"
        : "";

    // get Seqence Number from Ihub for InterchangeCtrlNbr
    let lastSeqNum;
    if (buyerID === "C1003" || buyerID === "C3001") {
      const dbName = tables.Invoice.name;
      const query = sql("mysql").select(dbName);
      query.where("CUSTOMER", "like", buyerID);
      query.orderBy("ID", "desc").limit(1);
      const queryResult = await query.run();
      lastSeqNum = tryit(() => queryResult.body.list[0].ID, 3000);

      const updateLastSeq = {
        ID: lastSeqNum + 1,
        INV_ID: getData("ID", invoice),
        CUSTOMER: buyerID,
      };

      const updateDB = sql("mysql").insert(dbName, updateLastSeq);
      await updateDB.run();
      draft.response.body[getData("ID", invoice)] = { updateLastSeq };
    }

    // [1]SAPINVOIC S
    const fileHeader = {
      TxCode,
      TxType,
      SupplierID: LG_GLN,
      SupplierName: getData("NAME", seller),
      SupplierAsignNbr: invoice.EXT001 || undefined,
      CustomerID: customerID,
      CustomerName: getData("NAME", buyer),
      CustomerPostCd: buyer.Address.PostalAddress.StreetPostalCode,
      FileGenNbr: lastSeqNum ? lastSeqNum + 1 : getData("ID", invoice),
      FileVerNbr,
      FileCreateDate,
    };
    if (buyerID === "C1004" && !fileHeader.SupplierAsignNbr) {
      fileHeader.SupplierAsignNbr = "239219";
    }
    /**
     * ASDA GLN UPDATE 이후 추가 필드 (Update 후 comment 제거)
     */
    // if (buyerID === "C1002") {
    //   fileHeader.SupplierVATRegNbr = "369646150";
    // }
    if (buyerID === "C3001" || buyerID === "C1005" || buyerID === "C1003") {
      const SupplierAddrArr = getData("PostalAddress", seller);
      fileHeader.SupplierAddr1 = SupplierAddrArr[0];
      fileHeader.SupplierAddr2 = SupplierAddrArr[1];
      fileHeader.SupplierAddr3 = SupplierAddrArr[2];
      fileHeader.SupplierAddr4 = SupplierAddrArr[3] || " ";
      fileHeader.SupplierVATRegStr = "GB369646150";
      const BillToAddrArr = getData("PostalAddress", billTo);
      fileHeader.CustomerAddr1 = BillToAddrArr[0];
      fileHeader.CustomerAddr2 = BillToAddrArr[1];
      fileHeader.CustomerAddr3 = BillToAddrArr[2];
      fileHeader.CustomerAddr4 = BillToAddrArr[3] || " ";
      // fileHeader.CustomerVATRegStr = "GB369646150";
      if (buyerID === "C1003") {
        fileHeader.CustomerVATRegStr = "GB660454836";
        fileHeader.CustomerVATRegNbr = "660454836";
        fileHeader.SupplierVATRegNbr = "369646150";
        fileHeader.SupplierAsignNbr = "L0420";
      }
      if (!fileHeader.SupplierAsignNbr) {
        if (buyerID === "C3001") {
          fileHeader.SupplierAsignNbr = "142425";
        }
        if (buyerID === "C1005") {
          fileHeader.SupplierAsignNbr = "1278080";
        }
      }
    }

    const CBP_UUID = recipient.PartyID._value_1;

    // byd 고객 코드
    const fCustomer = customer.find((data) => data.CBP_UUID === CBP_UUID) || {};

    // [2]MSG_GROUP S
    const customerName = getData("NAME", recipient);
    const customerPostal = recipient.Address.PostalAddress.StreetPostalCode;
    const invDate = invoice.Date.replace(/-/g, "").substr(2, 6);
    const pNTDate = itemCommon.PriceAndTax.TaxDate.replace(/-/g, "").substr(
      2,
      6
    );
    const msgHeader = {
      CustomerID: fCustomer.CGLN_ID,
      CustomerName: customerName,
      CustomerPostCd: customerPostal,
      InvoiceNbr: invoice.ID._value_1,
      InvoiceDate: invDate,
      TaxPntDate: pNTDate,
    };
    if (buyerID === "C3001" || buyerID === "C1003") {
      const ReciepAddArr = getData("PostalAddress", recipient);
      msgHeader.CustomerAddr1 = ReciepAddArr[0];
      msgHeader.CustomerAddr2 = ReciepAddArr[1];
      msgHeader.CustomerAddr3 = ReciepAddArr[2];
      msgHeader.CustomerAddr4 = ReciepAddArr[3] || " ";
    }

    // [3]MSG_REF_GROUP S
    // #SupplierOrderNbr# = invoice.ID
    const cOrderID = getData("ID", itemCommon.PurchaseOrderReference).replace(
      /PO_/g,
      ""
    );
    const oDID = getData("ID", itemCommon.OutboundDeliveryReference);
    const soID = getData("ID", itemCommon.SalesOrderReference);
    const soInfo = soData.d.results.find((so) => so.ID === soID);
    const OrderDateReceived = soInfo ? getDate(soInfo.CreationDateTime) : "";
    // SAINSBURY'S: C1003 WAITROSE: C1004, TESCO:C1001
    const odInfo = odData.d.results.find((od) => od.ID === oDID);
    const GoodsDeliveredDate =
      ["C1003", "C1004"].includes(buyerID) && odInfo && odInfo.Date.length > 0
        ? getDate(odInfo.Date[0].StartDateTime)
        : "";
    //  SAINSBURY'S: C1003
    const DelvNoteDate = buyerID === "C1003" ? GoodsDeliveredDate : "";
    // 고객 반품 건인 경우 DelvNoteNbr: 고객 송장ID로 처리(22.01.07)
    let DelvNoteNbr;
    if (invoiceType === "CI") {
      DelvNoteNbr = oDID;
    } else if (invoiceType === "CCM") {
      DelvNoteNbr = tryit(() =>
        getData("ID", itemCommon.OriginInvoiceReference)
      );
    }

    const msgReference = {
      CustomerOrderNbr: cOrderID,
      DelvNoteDate,
      OrderDateReceived,
      GoodsDeliveredDate,
    };
    if (buyerID === "C3001" || buyerID === "C1003") {
      msgReference.SupplierOrderNbr = getData("ID", invoice);
      msgReference.OrderDatePlaced = msgReference.OrderDateReceived;
    }
    if (buyerID === "C1005") {
      msgReference.Currency = tryit(
        () => invoice.PriceAndTax.GrossAmount.currencyCode
      );
    } else {
      // except C1005
      msgReference.DelvNoteNbr = DelvNoteNbr;
    }
    const msgRefGroup = [{ MSG_REFERENCE: msgReference }];

    let vatRate20Cnt = 0; // 20%
    let vatRate5Cnt = 0; // 5%
    let vatRate0Cnt = 0; // 0%
    for (let itemIdx = 0; itemIdx < invoice.Item.length; itemIdx++) {
      const ciItem = invoice.Item[itemIdx];
      const itemPriceNTax = ciItem.PriceAndTax;
      const itemAmount =
        paddingZero(itemPriceNTax.NetAmount._value_1, 1, 2) * 1;
      const taxAmount = paddingZero(itemPriceNTax.TaxAmount._value_1, 1, 2) * 1;
      const GrossAmount =
        paddingZero(itemPriceNTax.GrossAmount._value_1, 1, 2) * 1;

      let VATRateCd, tmpvatpct;
      const priceComp = itemPriceNTax.PriceComponents.find(
        (priceComp) => priceComp.Description._value_1 === "VAT (%)"
      );
      if (priceComp) {
        const rate = priceComp.Rate.DecimalValue;
        if (rate === "20.0") {
          ++vatRate20Cnt;
          VATRateCd = "S";
        } else if (rate === "5.0") {
          ++vatRate5Cnt;
          VATRateCd = "P";
        } else if (rate === "0.0") {
          ++vatRate0Cnt;
          VATRateCd = "Z";
        }
        SubTotItemAmt_LVLA[VATRateCd] += itemAmount;
        ExtSubTotItemAmt_EVLA[VATRateCd] += itemAmount;
        ExtSubTotAmtIncDisc_ASDA[VATRateCd] += itemAmount;
        VATAmt_VATA[VATRateCd] += taxAmount;
        PayableSubTotAmtIncDisc_APSI[VATRateCd] += GrossAmount;
        tmpvatpct = priceComp.Rate.DecimalValue;
      }
      const dstvatpct = paddingZero(tmpvatpct, 2, 3);

      // 자제마스터 조회
      // 자제 ID = ciItem.Product.InternalID._value_1;

      let EANCodeConsumer, QtyInPack, QtyInvoiced, DUNSCodeTraded;
      const internalID = ciItem.Product.InternalID._value_1;
      const Material = material.find(
        (item) => item.InternalID._value_1 === internalID
      );
      const itemCommonQtyType = getData("QTY_TYPE", itemCommon);
      const GTIN = Material.GlobalTradeItemNumber;
      const findGTI = (GTI, compare) =>
        GTI.TradingUnitCode._value_1 === compare;
      const fGTIN = ciItem.EXT008
        ? GTIN.find((GTI) => findGTI(GTI, ciItem.EXT008))
          ? GTIN.find((GTI) => findGTI(GTI, ciItem.EXT008))
          : GTIN.find((GTI) => findGTI(GTI, getData("QTY_TYPE", ciItem)))
        : GTIN.find((GTI) => findGTI(GTI, getData("QTY_TYPE", ciItem)));
      const GTIN_ID = fGTIN ? fGTIN.GlobalTradeID._value_1 : "";
      let EANCodeTraded = ciItem.EXT028 || GTIN_ID;

      // const GTIN_QTY = Material.QuantityConversion["0"].Quantity._value_1;
      // Material.QuantityConversion["0"].Quantity._value_1  환산수량
      /** 단위환산 로직 수정(23.08.02) */
      const UOM = ciItem.EXT008 || itemCommonQtyType;
      const fConversion = (Material.QuantityConversion || []).find(
        (conv) =>
          (conv.CorrespondingQuantity.unitCode === "EA" &&
            conv.Quantity.unitCode === UOM) ||
          (conv.CorrespondingQuantity.unitCode === UOM &&
            conv.Quantity.unitCode === "EA")
      );
      let GTIN_QTY;
      if (fConversion && fConversion.Quantity.unitCode === "EA") {
        const sourceValue = fConversion.Quantity._value_1;
        const targetValue = fConversion.CorrespondingQuantity._value_1;
        GTIN_QTY = Math.round((sourceValue / targetValue) * 1000) / 1000;
      } else if (
        fConversion &&
        fConversion.CorrespondingQuantity.unitCode === "EA"
      ) {
        const sourceValue = fConversion.CorrespondingQuantity._value_1;
        const targetValue = fConversion.Quantity._value_1;
        GTIN_QTY = Math.round((sourceValue / targetValue) * 1000) / 1000;
      } else GTIN_QTY = "1";
      if (ciItem.EXT008) {
        if (itemCommonQtyType === "EA" && ciItem.EXT008 !== "EA") {
          // 박스 단위: 수량 = 송장 EA 갯수 / 박스당 EA 갯수
          EANCodeConsumer = "";
          QtyInPack = Number(GTIN_QTY);
          QtyInvoiced =
            Math.round(
              (Number(getData("QTY", ciItem)) / Number(GTIN_QTY)) * 1000
            ) / 1000;
        } else {
          // 개별 단위 // 묶음단위가 ean이 필수다.. 일단 똑같이 보내본다.
          EANCodeConsumer = EANCodeTraded;
          QtyInPack = "1";
          QtyInvoiced = Number(getData("QTY", ciItem));
        }
      } else {
        EANCodeConsumer = itemCommonQtyType === "XBX" ? "" : EANCodeTraded;
        QtyInPack = itemCommonQtyType === "XBX" ? Number(GTIN_QTY) : "1";
        QtyInvoiced = Number(getData("QTY", ciItem));
      }
      const UnitPrice = paddingZero(
        Math.round(
          (Number(itemPriceNTax.NetAmount._value_1) / QtyInvoiced) * 10000
        ) / 10000,
        0,
        4
      );

      if (buyerID !== "C1005" && EANCodeTraded.length === 14) {
        DUNSCodeTraded = EANCodeTraded;
        EANCodeTraded = "";
        EANCodeConsumer = "";
      }

      const msgDetail = {
        ItemSeqNbr: ciItem.ID,
        EANCodeTraded,
        EANCodeConsumer,
        DUNSCodeTraded,
        QtyInPack,
        QtyInvoiced,
        UnitPrice,
        ItemAmount: paddingZero(itemPriceNTax.NetAmount._value_1, 0, 4),
        VATRateCd,
        VATRatePct: dstvatpct,
      };
      if (buyerID === "C3001") {
        msgDetail.TradedUnitDescr1 = getData("Description", ciItem);
      }
      msgRefGroup.push({ MSG_DETAIL: msgDetail });
      // 1..n
    }
    // MSG_REF_GROUP E
    const vatRateArr = [vatRate20Cnt, vatRate5Cnt, vatRate0Cnt];
    // MSG_SUB_TRAILER
    const msgSubTr = (countArr, AmtCd) => {
      const subTrailerArr = [];
      // vatRate20Cnt: "S","20000"
      // vatRate5Cnt: "P","05000"
      // vatRate0Cnt: "Z","00000"
      const getMsgSubTr = (VATRateCd, VATRatePct, itemCount, AmtCd) => {
        const EVLA = AmtCd.ExtSubTotItemAmt_EVLA[VATRateCd];
        const VATA = AmtCd.VATAmt_VATA[VATRateCd];
        const APSE = Number(EVLA) + Number(VATA);
        return {
          "MSG_SUB-TRAILER": {
            VATRateCd,
            VATRatePct,
            ItemCount: itemCount,
            SubTotItemAmount_LVLA: AmtCd.SubTotItemAmt_LVLA[VATRateCd],
            ExtSubTotItemAmount_EVLA: EVLA,
            ExtSubTotAmountIncDisc_ASDA:
              AmtCd.ExtSubTotAmtIncDisc_ASDA[VATRateCd],
            VATAmt_VATA: VATA,
            PayableSubTotAmtExcDisc_APSE: APSE,
            PayableSubTotAmtIncDisc_APSI:
              AmtCd.PayableSubTotAmtIncDisc_APSI[VATRateCd],
          },
        };
      };
      if (countArr[0] > 0) {
        subTrailerArr.push(getMsgSubTr("S", "20000", countArr[0], AmtCd));
      }
      if (countArr[1] > 0) {
        subTrailerArr.push(getMsgSubTr("P", "05000", countArr[1], AmtCd));
      }
      if (countArr[2] > 0) {
        subTrailerArr.push(getMsgSubTr("Z", "00000", countArr[2], AmtCd));
      }
      return subTrailerArr;
    };

    const iAmount = invoice.PriceAndTax;
    const invNetAmount = paddingZero(iAmount.NetAmount._value_1, 1, 2);
    const invTaxAmount = paddingZero(iAmount.TaxAmount._value_1, 1, 2);
    const invGrossAmount = paddingZero(iAmount.GrossAmount._value_1, 1, 2);

    const getTPSE = (TOTAL_AMOUNT_CODE) => {
      const { ExtSubTotItemAmt_EVLA, VATAmt_VATA } = TOTAL_AMOUNT_CODE;
      const VATRateCds = ["S", "P", "Z"];
      let TPSE = 0;
      VATRateCds.forEach((code) => {
        const EVLA = ExtSubTotItemAmt_EVLA[code];
        const VATA = VATAmt_VATA[code];
        TPSE = TPSE + Number(EVLA) + Number(VATA);
      });
      return TPSE;
    };

    // MSG_GROUP E
    const msgVatTr = (countArr, AmtCd) => {
      const msgVatTrailer = [];
      const getMsgVatTrailer = (VATRateCd, TOTAL_AMOUNT_CODE) => {
        const {
          VATAmt_VATA,
          SubTotItemAmt_LVLA,
          PayableSubTotAmtIncDisc_APSI,
          ExtSubTotItemAmt_EVLA,
        } = TOTAL_AMOUNT_CODE;
        const EVLA = ExtSubTotItemAmt_EVLA[VATRateCd];
        const VATA = VATAmt_VATA[VATRateCd];
        const APSE = Number(EVLA) + Number(VATA);
        return {
          MSG_VAT_TRAILER: {
            VATRateCd,
            VATRatePct: "20000",
            FileExtSubTotItemAmount_VSDE: SubTotItemAmt_LVLA[VATRateCd],
            FileExtSubTotAmountIncDisc_VSDI: SubTotItemAmt_LVLA[VATRateCd],
            FileVATAmt_VVAT: VATAmt_VATA[VATRateCd],
            FilePayableSubTotAmtExcDisc_VPSE: APSE,
            FilePayableSubTotAmtIncDisc_VPSI:
              PayableSubTotAmtIncDisc_APSI[VATRateCd],
          },
        };
      };
      // vatRate20Cnt: "S"  vatRate5Cnt: "P"  vatRate0Cnt: "Z"
      if (countArr[0] > 0) {
        msgVatTrailer.push(getMsgVatTrailer("S", AmtCd));
      }
      if (countArr[1] > 0) {
        msgVatTrailer.push(getMsgVatTrailer("P", AmtCd));
      }
      if (countArr[2] > 0) {
        msgVatTrailer.push(getMsgVatTrailer("Z", AmtCd));
      }
      return msgVatTrailer;
    };

    const inv2Xml = convXML({
      SAPINVOIC: [
        {
          TRANSMISSION: {
            SenderID: LG_GLN,
            SenderNM: getData("NAME", seller),
            ReceiverID: buyerStandardID,
            ReceiverNM: getData("NAME", buyer),
            TransDate: getFormatDate(new Date()),
            InterchangeCtrlNbr: getData("ID", invoice),
            PriorityCd: "B",
          },
        },
        { FILE_HEADER: fileHeader },
        {
          MSG_GROUP: [
            { MSG_HEADER: msgHeader },
            { MSG_REF_GROUP: msgRefGroup },
            ...msgSubTr(vatRateArr, TOTAL_AMOUNT_CODE),
            {
              MSG_TRAILER: {
                CntSubTrailer: vatRateArr.filter((count) => count > 0).length,
                SumSubTotItemAmount_LVLT: invNetAmount,
                SumExtSubTotItemAmount_EVLT: invNetAmount,
                SumSubTotDiscountAmt_SEDT:
                  buyerID === "C1003" ? "0" : undefined,
                SumExtSubTotAmountIncDisc_ASDT: invNetAmount,
                SumVATAmt_TVAT: invTaxAmount,
                SumPayableSubTotAmtExcDisc_TPSE: getTPSE(TOTAL_AMOUNT_CODE),
                Sum_PayableSubTotAmtIncDisc_TPSI: invGrossAmount,
              },
            },
          ],
        },
        ...msgVatTr(vatRateArr, TOTAL_AMOUNT_CODE),
        {
          FILE_TRAILER: {
            TotExtSubTotItemAmount_FASE: invNetAmount,
            TotExtSubTotAmountIncDisc_FASI: invNetAmount,
            TotVATAmt_FVAT: invTaxAmount,
            TotPayableSubTotAmtExcDisc_FPSE: getTPSE(TOTAL_AMOUNT_CODE),
            TotPayableSubTotAmtIncDisc_FPSI: invGrossAmount,
            TotInvoicDetail: "1",
          },
        },
      ],
    });
    iArr.push(['<?xml version="1.0" encoding="UTF-8"?>', inv2Xml].join(""));
  }

  function paddingZero(str, SpadCnt, EpadCnt) {
    // 숫자타입으로 올때가 있음
    str = str.toString();
    // 소수점 없으면 소수점 추가
    if (str.lastIndexOf(".") === -1) {
      str += ".0";
    }
    const splitArr = str.split(".");
    const newStr =
      splitArr[0].padStart(SpadCnt, "0") + splitArr[1].padEnd(EpadCnt, "0");
    return newStr;
  }
  draft.pipe.json.InvoiceArr = iArr;
  draft.response.body = { invoices: iArr };
};
