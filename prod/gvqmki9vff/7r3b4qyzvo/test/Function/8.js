module.exports = async (draft, { soap, odata }) => {
  const root = JSON.parse(draft.pipe.json.Invoices.body);
  const TargetCustomer = draft.pipe.json.targetCustomer;
  const ChangeGLNCustomer = draft.pipe.json.changeGLNCustomer;
  const ExceptTxCode = draft.pipe.json.exceptTxCode;
  const isTest = draft.pipe.json.isTest;
  const username = "CFO";
  const password = "QWEasd12";
  const reportNum = "RPZFB0E99AA3B329041AA01EF";
  const pid = isTest ? "my356725" : "my357084";
  const certAlias = isTest ? "test6" : "prod1";
  const MaterialwsdlAlias = isTest ? "test4" : "prod1";

  const today = new Date();
  const year = today.getFullYear().toString().substr(-2);
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1;
  const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

  const dateYYMMDD = `${year}${month}${date}`;
  // draft.response.body.push(root['CustomerInvoice']);

  const getData = (type, prop) => {
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
        default:
          break;
      }
    } catch (error) {
      return "";
    }
  };

  const dstArr = [];
  const ci = root.CustomerInvoice;
  if (ci && ci.length > 0) {
    let CBP_UUIDs = [],
      materialIDs = [],
      customer = [],
      material = [];
    ci.forEach((inv) => {
      const itemCommon = inv.Item["0"];
      const CBP_UUID = itemCommon.ProductRecipientParty.PartyID._value_1;
      CBP_UUIDs.push(CBP_UUID);
      inv.Item.forEach((item) => {
        const materialID = item.Product.InternalID._value_1;
        materialIDs.push(materialID);
      });
    });
    CBP_UUIDs = CBP_UUIDs.filter(
      (uuid, idx) => CBP_UUIDs.findIndex((item) => item === uuid) === idx
    );
    materialIDs = materialIDs.filter(
      (id, idx) => materialIDs.findIndex((item) => item === id) === idx
    );
    for (let idx = 0; idx < CBP_UUIDs.length; idx = idx + 15) {
      const slice = CBP_UUIDs.slice(idx, idx + 15);
      const filter = slice.map((CBP_UUID) => `CBP_UUID eq '${CBP_UUID}'`);
      const select = ["CBP_UUID", "CGLN_ID"].join(",");
      const queryString = [
        `$select=${select}`,
        `$filter=(${filter.join(" or ")})`,
        `$format=json`,
      ].join("&");

      const customerReport = [
        `https://${pid}.sapbydesign.com/sap/byd/odata`,
        `/ana_businessanalytics_analytics.svc`,
        `/${reportNum}QueryResults?`,
        queryString,
      ].join("");
      const getCustomer = await odata.get({
        url: customerReport,
        username,
        password,
      });
      customer = customer.concat(getCustomer.d.results);
    }

    for (let idx = 0; idx < materialIDs.length; idx = idx + 15) {
      const slice = materialIDs.slice(idx, idx + 15);
      const getMatrial = await soap(`querymaterials:${MaterialwsdlAlias}`, {
        p12ID: `lghhuktest:${certAlias}`,
        operation: "FindByElements",
        payload: {
          MaterialSelectionByElements: {
            SelectionByInternalID: slice.map((id) => {
              return {
                InclusionExclusionCode: "I",
                IntervalBoundaryTypeCode: "1",
                LowerBoundaryInternalID: id,
              };
            }),
          },
        },
      });
      const materialInfo =
        getMatrial.statusCode === 200 ? JSON.parse(getMatrial.body) : {};
      material = material.concat(materialInfo.Material);
    }

    for (let idx = 0; idx < ci.length; idx++) {
      const invoice = ci[idx];
      const itemCommon = invoice.Item["0"];
      const seller = invoice.SellerParty;
      const buyer = invoice.BuyerParty;
      const buyerID = buyer.PartyID._value_1;

      // 대상 고객만 송장 처리
      if (!TargetCustomer.includes(buyerID)) {
        continue;
      }

      if (buyer.StandardID["0"] === undefined) {
        // 오류 로그 처리해야 함...
        continue;
      }
      const buyerStandardID = getData("STANDARD_ID", buyer);
      const customerID = invoice.EXT019; // SFTP: FileHeader/customerID

      // 취소여부 태그 존재 확인(true면 취소송장 아님)
      const FileVerNbr = invoice.CancellationInvoiceIndicator ? "2" : "1";
      const adminData = invoice.SystemAdministrativeData;
      const FileCreateDate = adminData.LastChangeDateTime.replace(
        /-/g,
        ""
      ).substr(2, 6);

      const SubTotItemAmount_LVLA = { S: 0, P: 0, Z: 0 };
      const ExtSubTotItemAmount_EVLA = { S: 0, P: 0, Z: 0 };
      const ExtSubTotAmountIncDisc_ASDA = { S: 0, P: 0, Z: 0 };
      const VATAmt_VATA = { S: 0, P: 0, Z: 0 };
      const PayableSubTotAmtIncDisc_APSI = { S: 0, P: 0, Z: 0 };

      const LG_GLN = ChangeGLNCustomer.includes(buyerID)
        ? "5065004854009"
        : getData("STANDARD_ID", seller);

      // OPTIONAL
      const TxCode = ExceptTxCode.includes(buyerID)
        ? ""
        : "<TxCode>0700</TxCode>";
      const supplierAsignNbr = invoice.EXT001
        ? `<SupplierAsignNbr>${invoice.EXT001}</SupplierAsignNbr>`
        : "";

      // [1]SAPINVOIC S
      const tmpl_TRANSMISSION = [
        "<TRANSMISSION>",
        `<SenderID>${LG_GLN}</SenderID>`,
        `<SenderNM>${getData("NAME", seller)}</SenderNM>`,
        `<ReceiverID>${buyerStandardID}</ReceiverID>`,
        `<ReceiverNM>${getData("NAME", buyer)}</ReceiverNM>`,
        `<TransDate>${dateYYMMDD}</TransDate>`,
        `<InterchangeCtrlNbr>${invoice.ID._value_1}</InterchangeCtrlNbr>`,
        `<PriorityCd>B</PriorityCd>`,
        "</TRANSMISSION>",
      ]
        .join("")
        .replace(/&/g, "");

      const tmpl_FILEHEADER = [
        "<FILE_HEADER>",
        TxCode,
        `<SupplierID>${LG_GLN}</SupplierID>`,
        `<SupplierName>${getData("NAME", seller)}</SupplierName>`,
        supplierAsignNbr,
        `<CustomerID>${customerID}</CustomerID>`,
        `<CustomerName>${getData("NAME", buyer)}</CustomerName>`,
        // '<CustomerAddr1>#CustomerAddr1#</CustomerAddr1>',
        // '<CustomerAddr2>#CustomerAddr2#</CustomerAddr2>',
        // '<CustomerAddr3>#CustomerAddr3#</CustomerAddr3>',
        `<CustomerPostCd>`,
        `${buyer.Address.PostalAddress.StreetPostalCode}`,
        `</CustomerPostCd>`,
        `<FileGenNbr>${invoice.ID._value_1}</FileGenNbr>`,
        `<FileVerNbr>${FileVerNbr}</FileVerNbr>`,
        `<FileCreateDate>${FileCreateDate}</FileCreateDate>`,
        "</FILE_HEADER>",
      ]
        .join("")
        .replace(/&/g, "");

      const CBP_UUID = itemCommon.ProductRecipientParty.PartyID._value_1;

      // byd 고객 코드
      const fCustomer =
        customer.find((data) => data.CBP_UUID === CBP_UUID) || {};

      // [2]MSG_GROUP S
      const customerName = getData("NAME", itemCommon.ProductRecipientParty);
      const customerPostal =
        itemCommon.ProductRecipientParty.Address.PostalAddress.StreetPostalCode;
      const invDate = invoice.Date.replace(/-/g, "").substr(2, 6);
      const pNTDate = itemCommon.PriceAndTax.TaxDate.replace(/-/g, "").substr(
        2,
        6
      );

      const tmpl_MSG_HEADER = [
        "<MSG_GROUP>",
        "<MSG_HEADER>",
        `<CustomerID>${fCustomer.CGLN_ID}</CustomerID>`,
        // '<CustomerOwnCd>#CustomerOwnCd#</CustomerOwnCd>',
        `<CustomerName>${customerName}</CustomerName>`,
        // '<CustomerAddr1>#CustomerAddr1#</CustomerAddr1>',
        // '<CustomerAddr2>#CustomerAddr2#</CustomerAddr2>',
        // '<CustomerAddr3>#CustomerAddr3#</CustomerAddr3>',
        // '<CustomerAddr4>#CustomerAddr4#</CustomerAddr4>',
        `<CustomerPostCd>${customerPostal}</CustomerPostCd>`,
        `<InvoiceNbr>${invoice.ID._value_1}</InvoiceNbr>`,
        `<InvoiceDate>${invDate}</InvoiceDate>`,
        `<TaxPntDate>${pNTDate}</TaxPntDate>`,
        "</MSG_HEADER>",
      ].join("");

      // [3]MSG_REF_GROUP S
      // #SupplierOrderNbr# = invoice.ID
      const cOrderID = getData("ID", itemCommon.PurchaseOrderReference).replace(
        /PO_/g,
        ""
      );
      const oDID = getData("ID", itemCommon.OutboundDeliveryReference);
      const tmpl_MSG_REFERENCE = [
        "<MSG_REF_GROUP>",
        "<MSG_REFERENCE>",
        `<CustomerOrderNbr>${cOrderID}</CustomerOrderNbr>`,
        `<DelvNoteNbr>${oDID}</DelvNoteNbr>`,
        "</MSG_REFERENCE>",
      ].join("");

      let VATRateCd;
      let vatRate20Cnt = 0; // 20%
      let vatRate5Cnt = 0; // 5%
      let vatRate0Cnt = 0; // 0%
      let dstMSG_DETAIL = "";
      for (let itemIdx = 0; itemIdx < invoice.Item.length; itemIdx++) {
        const ciItem = invoice.Item[itemIdx];
        const itemPriceNTax = ciItem.PriceAndTax;
        const itemAmount =
          paddingZero(itemPriceNTax.NetAmount._value_1, 1, 2) * 1;
        const taxAmount =
          paddingZero(itemPriceNTax.TaxAmount._value_1, 1, 2) * 1;
        const GrossAmount =
          paddingZero(itemPriceNTax.GrossAmount._value_1, 1, 2) * 1;

        let tmpvatpct;
        const priceComp = itemPriceNTax.PriceComponents.find(
          (priceComp) => priceComp.Description._value_1 === "VAT (%)"
        );
        if (priceComp) {
          switch (priceComp.Rate.DecimalValue) {
            case "20.0":
              ++vatRate20Cnt;
              VATRateCd = "S";
              break;
            case "5.0":
              ++vatRate5Cnt;
              VATRateCd = "P";
              break;
            case "0.0":
              ++vatRate0Cnt;
              VATRateCd = "Z";
              break;
            default:
              break;
          }
          SubTotItemAmount_LVLA[VATRateCd] += itemAmount;
          ExtSubTotItemAmount_EVLA[VATRateCd] += itemAmount;
          ExtSubTotAmountIncDisc_ASDA[VATRateCd] += itemAmount;
          VATAmt_VATA[VATRateCd] += taxAmount;
          PayableSubTotAmtIncDisc_APSI[VATRateCd] += GrossAmount;
          tmpvatpct = priceComp.Rate.DecimalValue;
        }

        const dstvatpct = paddingZero(tmpvatpct, 2, 3);

        // 자제마스터 조회
        // 자제 ID = ciItem.Product.InternalID._value_1;

        let EANCodeConsumer, QtyInPack, QtyInvoiced;
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
        const GTIN_QTY = Material.QuantityConversion["0"].Quantity._value_1;
        // Material.QuantityConversion['0'].Quantity._value_1  환산수량
        if (ciItem.EXT008) {
          if (itemCommonQtyType === "EA" && ciItem.EXT008 !== "EA") {
            // 박스 단위
            EANCodeConsumer = "";
            QtyInPack = Number(GTIN_QTY);
            // 수량 = 송장 EA 갯수 / 박스당 EA 갯수
            QtyInvoiced = Number(getData("QTY", ciItem)) / Number(GTIN_QTY);
          } else {
            // 개별 단위 // 묶음단위가 ean이 필수다.. 일단 똑같이 보내본다.
            EANCodeConsumer = GTIN_ID;
            QtyInPack = "1";
            QtyInvoiced = Number(getData("QTY", ciItem));
          }
        } else {
          EANCodeConsumer = itemCommonQtyType === "XBX" ? "" : GTIN_ID;
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

        const tmpMSG_DETAIL = [
          "<MSG_DETAIL>",
          `<ItemSeqNbr>${ciItem.ID}</ItemSeqNbr>`,
          `<EANCodeTraded>${GTIN_ID}</EANCodeTraded>`,
          `<EANCodeConsumer>${EANCodeConsumer}</EANCodeConsumer>`,
          `<QtyInPack>${QtyInPack}</QtyInPack>`,
          `<QtyInvoiced>${QtyInvoiced}</QtyInvoiced>`,
          `<UnitPrice>${UnitPrice}</UnitPrice>`,
          `<ItemAmount>`,
          `${paddingZero(itemPriceNTax.NetAmount._value_1, 0, 4)}`,
          `</ItemAmount>`,
          `<VATRateCd>${VATRateCd}</VATRateCd>`,
          `<VATRatePct>${dstvatpct}</VATRatePct>`,
          "</MSG_DETAIL>",
        ].join(""); // 1..n

        dstMSG_DETAIL = dstMSG_DETAIL + tmpMSG_DETAIL;
      }
      dstMSG_DETAIL = dstMSG_DETAIL + "</MSG_REF_GROUP>";
      // MSG_REF_GROUP E
      // MSG_SUB_TRAILER
      let VATRatePct;
      let itemCount;

      if (vatRate20Cnt > 0) {
        VATRateCd = "S";
        VATRatePct = "20000";
        itemCount = vatRate20Cnt;
      } else if (vatRate5Cnt > 0) {
        VATRateCd = "P";
        VATRatePct = "05000";
        itemCount = vatRate5Cnt;
      } else if (vatRate0Cnt > 0) {
        VATRateCd = "Z";
        VATRatePct = "00000";
        itemCount = vatRate0Cnt;
      }

      const dstMSG_SUB_TRAILER = [
        "<MSG_SUB-TRAILER>",
        `<VATRateCd>${VATRateCd}</VATRateCd>`,
        `<VATRatePct>${VATRatePct}</VATRatePct>`,
        `<ItemCount>${itemCount}</ItemCount>`,
        `<SubTotItemAmount_LVLA>`,
        `${SubTotItemAmount_LVLA[VATRateCd]}`,
        `</SubTotItemAmount_LVLA>`,
        `<ExtSubTotItemAmount_EVLA>`,
        `${ExtSubTotItemAmount_EVLA[VATRateCd]}`,
        `</ExtSubTotItemAmount_EVLA>`,
        `<ExtSubTotAmountIncDisc_ASDA>`,
        `${ExtSubTotAmountIncDisc_ASDA[VATRateCd]}`,
        `</ExtSubTotAmountIncDisc_ASDA>`,
        `<VATAmt_VATA>${VATAmt_VATA[VATRateCd]}</VATAmt_VATA>`,
        `<PayableSubTotAmtIncDisc_APSI>`,
        `${PayableSubTotAmtIncDisc_APSI[VATRateCd]}`,
        `</PayableSubTotAmtIncDisc_APSI>`,
        "</MSG_SUB-TRAILER>",
      ].join("");

      let vatRateCdCnt = 0;
      if (vatRate20Cnt > 0) {
        ++vatRateCdCnt;
      }
      if (vatRate5Cnt > 0) {
        ++vatRateCdCnt;
      }
      if (vatRate0Cnt > 0) {
        ++vatRateCdCnt;
      }

      const iAmount = invoice.PriceAndTax;
      const invNetAmount = paddingZero(iAmount.NetAmount._value_1, 1, 2);
      const invTaxAmount = paddingZero(iAmount.TaxAmount._value_1, 1, 2);
      const invGrossAmount = paddingZero(iAmount.GrossAmount._value_1, 1, 2);

      const tmpl_MSG_TRAILER = [
        "<MSG_TRAILER>",
        `<CntSubTrailer>${vatRateCdCnt}</CntSubTrailer>`,
        `<SumSubTotItemAmount_LVLT>`,
        `${invNetAmount}`,
        `</SumSubTotItemAmount_LVLT>`,
        `<SumExtSubTotItemAmount_EVLT>`,
        `${invNetAmount}`,
        `</SumExtSubTotItemAmount_EVLT>`,
        `<SumExtSubTotAmountIncDisc_ASDT>`,
        `${invNetAmount}`,
        `</SumExtSubTotAmountIncDisc_ASDT>`,
        `<SumVATAmt_TVAT>${invTaxAmount}</SumVATAmt_TVAT>`,
        `<Sum_PayableSubTotAmtIncDisc_TPSI>`,
        `${invGrossAmount}`,
        `</Sum_PayableSubTotAmtIncDisc_TPSI>`,
        "</MSG_TRAILER>",
        "</MSG_GROUP>",
      ].join("");

      // MSG_GROUP E
      if (vatRate20Cnt > 0) {
        VATRateCd = "S";
      } else if (vatRate5Cnt > 0) {
        VATRateCd = "P";
      } else if (vatRate0Cnt > 0) {
        VATRateCd = "Z";
      }
      const tmpMSG_VAT_TRAILER = [
        "<MSG_VAT_TRAILER>",
        `<VATRateCd>${VATRateCd}</VATRateCd>`,
        `<VATRatePct>20000</VATRatePct>`,
        `<FileExtSubTotItemAmount_VSDE>`,
        `${SubTotItemAmount_LVLA[VATRateCd]}`,
        `</FileExtSubTotItemAmount_VSDE>`,
        `<FileExtSubTotAmountIncDisc_VSDI>`,
        `${SubTotItemAmount_LVLA[VATRateCd]}`,
        `</FileExtSubTotAmountIncDisc_VSDI>`,
        `<FileVATAmt_VVAT>${VATAmt_VATA[VATRateCd]}</FileVATAmt_VVAT>`,
        `<FilePayableSubTotAmtIncDisc_VPSI>`,
        `${PayableSubTotAmtIncDisc_APSI[VATRateCd]}`,
        `</FilePayableSubTotAmtIncDisc_VPSI>`,
        "</MSG_VAT_TRAILER>",
      ].join("");

      const tmpl_FILE_TRAILER = [
        "<FILE_TRAILER>",
        `<TotExtSubTotItemAmount_FASE>`,
        `${invNetAmount}`,
        `</TotExtSubTotItemAmount_FASE>`,
        `<TotExtSubTotAmountIncDisc_FASI>`,
        `${invNetAmount}`,
        `</TotExtSubTotAmountIncDisc_FASI>`,
        `<TotVATAmt_FVAT>${invTaxAmount}</TotVATAmt_FVAT>`,
        `<TotPayableSubTotAmtIncDisc_FPSI>`,
        `${invGrossAmount}`,
        `</TotPayableSubTotAmtIncDisc_FPSI>`,
        `<TotInvoicDetail>1</TotInvoicDetail>`,
        "</FILE_TRAILER>",
      ].join("");

      const dstXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<SAPINVOIC>",
        tmpl_TRANSMISSION,
        tmpl_FILEHEADER,
        tmpl_MSG_HEADER,
        tmpl_MSG_REFERENCE,
        dstMSG_DETAIL,
        dstMSG_SUB_TRAILER,
        tmpl_MSG_TRAILER,
        tmpMSG_VAT_TRAILER,
        tmpl_FILE_TRAILER,
        "</SAPINVOIC>",
      ].join("");

      dstArr[idx] = dstXml;
      draft.response.body.push(dstArr[idx]);
    }
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

  draft.pipe.json.InvoiceArr = dstArr;
};
