module.exports = async (draft, { soap, odata }) => {
  const root = JSON.parse(draft.pipe.json.Invoices["body"]);

  const isTest = draft.pipe.json.isTest;

  let MaterialwsdlAlias = "";

  let certAlias = "";

  let url;
  let username;
  let password;

  let tmpurl;

  if (isTest) {
    MaterialwsdlAlias = "test3";

    certAlias = "test4";

    // tmpurl = `https://my356725.sapbydesign.com/sap/byd/odata/
    // ana_businessanalytics_analytics.svc/
    // RPZFB23C649C7ABFE7A390973QueryResults?
    // $select=CBP_UUID,CGLN_ID&$format=json`;
    tmpurl = `https://my356725.sapbydesign.com/sap/byd/odata/
        ana_businessanalytics_analytics.svc/
        RPZFB23C649C7ABFE7A390973QueryResults?$select=CBP_UUID,CGLN_ID
        &$filter=(CBP_UUID%20eq%20%27#CBP_UUID#%27)&$format=json`;
    username = "bsg1";
    password = "1234";
  } else {
    MaterialwsdlAlias = "prod1";

    certAlias = "prod1";

    tmpurl = `https://my357084.sapbydesign.com/sap/byd/odata/
        ana_businessanalytics_analytics.svc/
        RPZFB0E99AA3B329041AA01EFQueryResults?$select=CBP_UUID,CGLN_ID
        &$filter=(CBP_UUID%20eq%20%27#CBP_UUID#%27)&$format=json`;
    username = "CFO";
    password = "QWEasd12";
  }

  // draft.response.body.push(root['CustomerInvoice']);
  // draft.response.body.push(root['CustomerInvoice'].length);
  // draft.response.body.push(Object.keys(root));

  const dstArr = [];
  if (root["CustomerInvoice"] !== undefined) {
    for (let k = 0; k < root["CustomerInvoice"].length; k++) {
      if (
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["StandardID"]["0"] ===
        undefined
      ) {
        //오류 로그 처리해야 함...
        continue;
      }

      const buyerP =
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["PartyID"]["_value_1"];

      if (
        buyerP !== "C1002" &&
        buyerP !== "C4001" &&
        buyerP !== "C3001" &&
        buyerP !== "C3002"
      ) {
        // draft.response.body.push(buyerP)
        continue;
      }

      //[1]SAPINVOIC S
      let tmpl_TRANSMISSION =
        "<TRANSMISSION>" +
        "<SenderID>#SenderID#</SenderID>" +
        "<SenderNM>#SenderNM#</SenderNM>" +
        "<ReceiverID>#ReceiverID#</ReceiverID>" +
        "<ReceiverNM>#ReceiverNM#</ReceiverNM>" +
        "<TransDate>#TransDate#</TransDate>" +
        "<InterchangeCtrlNbr>#InterchangeCtrlNbr#</InterchangeCtrlNbr>" +
        "<PriorityCd>#PriorityCd#</PriorityCd>" +
        "</TRANSMISSION>";

      let tmpl_FILEHEADER = "<FILE_HEADER>";
      if (
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["StandardID"]["0"][
          "_value_1"
        ] === "C1002"
      ) {
        tmpl_FILEHEADER = tmpl_FILEHEADER + "<TxCode>#<TxCode>#</TxCode>";
      }
      tmpl_FILEHEADER =
        tmpl_FILEHEADER +
        "<SupplierID>#SupplierID#</SupplierID>" +
        "<SupplierName>#SupplierName#</SupplierName>" +
        "<CustomerID>#CustomerID#</CustomerID>" +
        "<CustomerName>#CustomerName#</CustomerName>" +
        // +'<CustomerAddr1>#CustomerAddr1#</CustomerAddr1>'
        // +'<CustomerAddr2>#CustomerAddr2#</CustomerAddr2>'
        // +'<CustomerAddr3>#CustomerAddr3#</CustomerAddr3>'
        "<CustomerPostCd>#CustomerPostCd#</CustomerPostCd>" +
        "<FileGenNbr>#FileGenNbr#</FileGenNbr>" +
        "<FileVerNbr>#FileVerNbr#</FileVerNbr>" +
        "<FileCreateDate>#FileCreateDate#</FileCreateDate>" +
        "</FILE_HEADER>";
      //[2]MSG_GROUP S
      let tmpl_MSG_HEADER =
        "<MSG_GROUP>" +
        "<MSG_HEADER>" +
        "<CustomerID>#CustomerID#</CustomerID>" +
        // +'<CustomerOwnCd>#CustomerOwnCd#</CustomerOwnCd>'
        "<CustomerName>#CustomerName#</CustomerName>" +
        // +'<CustomerAddr1>#CustomerAddr1#</CustomerAddr1>'
        // +'<CustomerAddr2>#CustomerAddr2#</CustomerAddr2>'
        // +'<CustomerAddr3>#CustomerAddr3#</CustomerAddr3>'
        // +'<CustomerAddr4>#CustomerAddr4#</CustomerAddr4>'
        "<CustomerPostCd>#CustomerPostCd#</CustomerPostCd>" +
        "<InvoiceNbr>#InvoiceNbr#</InvoiceNbr>" +
        "<InvoiceDate>#InvoiceDate#</InvoiceDate>" +
        "<TaxPntDate>#TaxPntDate#</TaxPntDate>" +
        "</MSG_HEADER>";

      //[3]MSG_REF_GROUP S
      let tmpl_MSG_REFERENCE =
        "<MSG_REF_GROUP>" +
        "<MSG_REFERENCE>" +
        "<CustomerOrderNbr>#CustomerOrderNbr#</CustomerOrderNbr>" +
        "<DelvNoteNbr>#DelvNoteNbr#</DelvNoteNbr>" +
        "</MSG_REFERENCE>";
      const tmpl_MSG_DETAIL =
        "<MSG_DETAIL>" +
        "<ItemSeqNbr>#ItemSeqNbr#</ItemSeqNbr>" +
        "<EANCodeTraded>#EANCodeTraded#</EANCodeTraded>" +
        "<EANCodeConsumer>#EANCodeConsumer#</EANCodeConsumer>" +
        "<QtyInPack>#QtyInPack#</QtyInPack>" +
        "<QtyInvoiced>#QtyInvoiced#</QtyInvoiced>" +
        "<UnitPrice>#UnitPrice#</UnitPrice>" +
        "<ItemAmount>#ItemAmount#</ItemAmount>" +
        "<VATRateCd>#VATRateCd#</VATRateCd>" +
        "<VATRatePct>#VATRatePct#</VATRatePct>" +
        "</MSG_DETAIL>"; //1..n
      //MSG_REF_GROUP E
      const tmpl_MSG_SUB_TRAILER =
        "<MSG_SUB-TRAILER>" +
        "<VATRateCd>#VATRateCd#</VATRateCd>" +
        "<VATRatePct>#VATRatePct#</VATRatePct>" +
        "<ItemCount>#ItemCount#</ItemCount>" +
        `<SubTotItemAmount_LVLA>#SubTotItemAmount_LVLA#
            </SubTotItemAmount_LVLA>` +
        `<ExtSubTotItemAmount_EVLA>#ExtSubTotItemAmount_EVLA#
            </ExtSubTotItemAmount_EVLA>` +
        `<ExtSubTotAmountIncDisc_ASDA>#ExtSubTotAmountIncDisc_ASDA#
            </ExtSubTotAmountIncDisc_ASDA>` +
        "<VATAmt_VATA>#VATAmt_VATA#</VATAmt_VATA>" +
        `<PayableSubTotAmtIncDisc_APSI>#PayableSubTotAmtIncDisc_APSI#
            </PayableSubTotAmtIncDisc_APSI>` +
        "</MSG_SUB-TRAILER>";
      let tmpl_MSG_TRAILER =
        "<MSG_TRAILER>" +
        "<CntSubTrailer>#CntSubTrailer#</CntSubTrailer>" +
        `<SumSubTotItemAmount_LVLT>#SumSubTotItemAmount_LVLT#
        </SumSubTotItemAmount_LVLT>` +
        `<SumExtSubTotItemAmount_EVLT>#SumExtSubTotItemAmount_EVLT#
        </SumExtSubTotItemAmount_EVLT>` +
        `<SumExtSubTotAmountIncDisc_ASDT>#SumExtSubTotAmountIncDisc_ASDT#
        </SumExtSubTotAmountIncDisc_ASDT>` +
        "<SumVATAmt_TVAT>#SumVATAmt_TVAT#</SumVATAmt_TVAT>" +
        `<Sum_PayableSubTotAmtIncDisc_TPSI>#Sum_PayableSubTotAmtIncDisc_TPSI#
        </Sum_PayableSubTotAmtIncDisc_TPSI>` +
        "</MSG_TRAILER>" +
        "</MSG_GROUP>";
      //MSG_GROUP E
      const tmpl_MSG_VAT_TRAILER =
        "<MSG_VAT_TRAILER>" +
        "<VATRateCd>#VATRateCd#</VATRateCd>" +
        "<VATRatePct>#VATRatePct#</VATRatePct>" +
        `<FileExtSubTotItemAmount_VSDE>#FileExtSubTotItemAmount_VSDE#
        </FileExtSubTotItemAmount_VSDE>` +
        `<FileExtSubTotAmountIncDisc_VSDI>#FileExtSubTotAmountIncDisc_VSDI#
        </FileExtSubTotAmountIncDisc_VSDI>` +
        "<FileVATAmt_VVAT>#FileVATAmt_VVAT#</FileVATAmt_VVAT>" +
        `<FilePayableSubTotAmtIncDisc_VPSI>#FilePayableSubTotAmtIncDisc_VPSI#
        </FilePayableSubTotAmtIncDisc_VPSI>` +
        "</MSG_VAT_TRAILER>";
      let tmpl_FILE_TRAILER =
        "<FILE_TRAILER>" +
        `<TotExtSubTotItemAmount_FASE>#TotExtSubTotItemAmount_FASE#
        </TotExtSubTotItemAmount_FASE>` +
        `<TotExtSubTotAmountIncDisc_FASI>#TotExtSubTotAmountIncDisc_FASI#
        </TotExtSubTotAmountIncDisc_FASI>` +
        "<TotVATAmt_FVAT>#TotVATAmt_FVAT#</TotVATAmt_FVAT>" +
        `<TotPayableSubTotAmtIncDisc_FPSI>#TotPayableSubTotAmtIncDisc_FPSI#
        </TotPayableSubTotAmtIncDisc_FPSI>` +
        "<TotInvoicDetail>#TotInvoicDetail#</TotInvoicDetail>" +
        "</FILE_TRAILER>";

      let dstXml = "";
      let dstMSG_DETAIL = "";
      let tmpMSG_DETAIL = "";
      let dstMSG_SUB_TRAILER = "";
      let tmpMSG_SUB_TRAILER = "";
      let dstMSG_VAT_TRAILER = "";
      let tmpMSG_VAT_TRAILER = "";

      //console.dir(JSON.stringify(result));

      //인보이스 갯수
      // console.log(root['CustomerInvoice'].length);

      // 취소여부 태그 존재 확인(true면 취소송장 아님)
      // console.log(root['CustomerInvoice'][`${k}`]
      // ['CancellationInvoiceIndicator'] === undefined);

      // console.log(root['CustomerInvoice'][`${k}`]
      // ['SellerParty']['StandardID']['0']['_value_1']);

      const today = new Date();
      // 년도(뒤에 2자리)
      const year = today.getFullYear().toString().substr(-2);
      let month = today.getMonth() + 1; // 월
      let date = today.getDate(); // 날짜
      let hour = today.getHours(); // 시간
      let minute = today.getMinutes();
      let second = today.getSeconds();

      if (month < 10) {
        month = "0" + month.toString();
      }
      if (date < 10) {
        date = "0" + date.toString();
      }
      if (hour < 10) {
        hour = "0" + hour.toString();
      }
      if (minute < 10) {
        minute = "0" + minute.toString();
      }
      if (second < 10) {
        second = "0" + second.toString();
      }

      //let day = today.getDay();  // 요일
      const dateYYMMDD = year + month + date;
      // const timeHHMMSS =
      //   hour.toString() + minute.toString() + second.toString();
      let vatRate20Cnt = 0; //20%
      let vatRate5Cnt = 0; //5%
      let vatRate0Cnt = 0; //0%

      const SubTotItemAmount_LVLA = { S: 0, P: 0, Z: 0 };
      const ExtSubTotItemAmount_EVLA = { S: 0, P: 0, Z: 0 };
      const ExtSubTotAmountIncDisc_ASDA = { S: 0, P: 0, Z: 0 };
      const VATAmt_VATA = { S: 0, P: 0, Z: 0 };
      const PayableSubTotAmtIncDisc_APSI = { S: 0, P: 0, Z: 0 };

      tmpl_TRANSMISSION = tmpl_TRANSMISSION.replace(
        /#SenderID#/g,
        root["CustomerInvoice"][`${k}`]["SellerParty"]["StandardID"]["0"][
          "_value_1"
        ]
      );
      tmpl_TRANSMISSION = tmpl_TRANSMISSION
        .replace(
          /#SenderNM#/g,
          root["CustomerInvoice"][`${k}`]["SellerParty"]["Address"][
            "FirstLineName"
          ].substr(0, 34)
        )
        .replace(/&/g, "");
      tmpl_TRANSMISSION = tmpl_TRANSMISSION.replace(
        /#ReceiverID#/g,
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["StandardID"]["0"][
          "_value_1"
        ]
      );
      tmpl_TRANSMISSION = tmpl_TRANSMISSION
        .replace(
          /#ReceiverNM#/g,
          root["CustomerInvoice"][`${k}`]["BuyerParty"]["Address"][
            "FirstLineName"
          ].substr(0, 34)
        )
        .replace(/&/g, "");
      tmpl_TRANSMISSION = tmpl_TRANSMISSION.replace(/#TransDate#/g, dateYYMMDD);
      // tmpl_TRANSMISSION =
      // tmpl_TRANSMISSION.replace(/#TransTime#/g, timeHHMMSS);
      tmpl_TRANSMISSION = tmpl_TRANSMISSION.replace(
        /#InterchangeCtrlNbr#/g,
        root["CustomerInvoice"][`${k}`]["ID"]["_value_1"]
      );
      tmpl_TRANSMISSION = tmpl_TRANSMISSION.replace(/#PriorityCd#/g, "B");

      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(/#TxCode#/g, "0700");
      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(
        /#SupplierID#/g,
        root["CustomerInvoice"][`${k}`]["SellerParty"]["StandardID"]["0"][
          "_value_1"
        ]
      );
      tmpl_FILEHEADER = tmpl_FILEHEADER
        .replace(
          /#SupplierName#/g,
          root["CustomerInvoice"][`${k}`]["SellerParty"]["Address"][
            "FirstLineName"
          ].substr(0, 34)
        )
        .replace(/&/g, "");
      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(
        /#CustomerID#/g,
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["StandardID"]["0"][
          "_value_1"
        ]
      );
      tmpl_FILEHEADER = tmpl_FILEHEADER
        .replace(
          /#CustomerName#/g,
          root["CustomerInvoice"][`${k}`]["BuyerParty"]["Address"][
            "FirstLineName"
          ].substr(0, 34)
        )
        .replace(/&/g, "");
      // tmpl_FILEHEADER =
      // tmpl_FILEHEADER.replace(/#CustomerAddr1#/g,
      // root['CustomerInvoice'][`${k}`]['BuyerParty']['Address']
      // ['PostalAddress']['StreetPrefixName'].substr(0, 34));
      // tmpl_FILEHEADER = tmpl_FILEHEADER.replace(/#CustomerAddr2#/g,
      // root['CustomerInvoice'][`${k}`]['BuyerParty']['Address']
      // ['PostalAddress']['StreetPrefixName'].substr(35) );
      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(
        /#CustomerPostCd#/g,
        root["CustomerInvoice"][`${k}`]["BuyerParty"]["Address"][
          "PostalAddress"
        ]["StreetPostalCode"]
      );
      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(
        /#FileGenNbr#/g,
        root["CustomerInvoice"][`${k}`]["ID"]["_value_1"]
      );
      if (
        root["CustomerInvoice"][`${k}`]["CancellationInvoiceIndicator"] ===
        undefined
      ) {
        tmpl_FILEHEADER = tmpl_FILEHEADER.replace(/#FileVerNbr#/g, "1");
      } else {
        tmpl_FILEHEADER = tmpl_FILEHEADER.replace(/#FileVerNbr#/g, "2");
      }
      tmpl_FILEHEADER = tmpl_FILEHEADER.replace(
        /#FileCreateDate#/g,
        root["CustomerInvoice"][`${k}`]["SystemAdministrativeData"][
          "LastChangeDateTime"
        ]
          .replace(/-/g, "")
          .substr(2, 6)
      );

      url = tmpurl.replace(
        /#CBP_UUID#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"]["ProductRecipientParty"][
          "PartyID"
        ]["_value_1"]
      );
      //odata 첫번째 파라미터 이름은 url이 되야 한다..

      // draft.response.body.push(url); //byd 고객 코드

      const customer = await odata.get({ url, username, password });

      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#CustomerID#/g,
        customer.d.results[0].CGLN_ID
      );

      //전체 조회용
      // let customerArr = await odata.get({ url, username, password });
      // for(let l=0; l < customerArr;l++ ){
      //     if(customerArr.d.results[l].CBP_UUID ===
      // root['CustomerInvoice'][`${k}`]['Item']['0']
      // ['ProductRecipientParty']['PartyID']['_value_1']){
      //         tmpl_MSG_HEADER = tmpl_MSG_HEADER.
      // replace(/#CustomerID#/g, customerArr.d.results[l].CGLN_ID);
      //         break;
      //     }
      // }

      // draft.response.body.push(customerArr.d.results[l].CBP_UUID);
      //byd 고객 코드
      // draft.response.body.push(customerArr.d.results[l].CGLN_ID);
      //gln코드

      // tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(/#CustomerOwnCd#/g,
      // root['CustomerInvoice'][`${k}`]
      // ['ReferenceBusinessTransactionDocumentID']['_value_1']);
      //고객 시스템의 장소 코드를 byd에 저장하기 애매함. 공백으로 보냄.
      // tmpl_MSG_HEADER =
      // tmpl_MSG_HEADER.replace(/#CustomerOwnCd#/g, ' ');
      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#CustomerName#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"]["ProductRecipientParty"][
          "Address"
        ]["FirstLineName"]
      );
      // tmpl_MSG_HEADER =
      // tmpl_MSG_HEADER.replace(/#CustomerAddr1#/g,
      // root['CustomerInvoice'][`${k}`]['BuyerParty']['Address']
      // ['PostalAddress']['StreetPrefixName'].substr(0, 34));
      // tmpl_MSG_HEADER =
      // tmpl_MSG_HEADER.replace(/#CustomerAddr2#/g,
      // root['CustomerInvoice'][`${k}`]['BuyerParty']['Address']
      // ['PostalAddress']['StreetPrefixName'].substr(35));
      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#CustomerPostCd#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"]["ProductRecipientParty"][
          "Address"
        ]["PostalAddress"]["StreetPostalCode"]
      );
      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#InvoiceNbr#/g,
        root["CustomerInvoice"][`${k}`]["ID"]["_value_1"]
      );
      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#InvoiceDate#/g,
        root["CustomerInvoice"][`${k}`]["Date"].replace(/-/g, "").substr(2, 6)
      );
      tmpl_MSG_HEADER = tmpl_MSG_HEADER.replace(
        /#TaxPntDate#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"]["PriceAndTax"]["TaxDate"]
          .replace(/-/g, "")
          .substr(2, 6)
      );

      tmpl_MSG_REFERENCE = tmpl_MSG_REFERENCE.replace(
        /#CustomerOrderNbr#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"]["PurchaseOrderReference"][
          "ID"
        ]["_value_1"]
      );

      tmpl_MSG_REFERENCE = tmpl_MSG_REFERENCE.replace(
        /#SupplierOrderNbr#/g,
        root["CustomerInvoice"][`${k}`]["ID"]
      );
      tmpl_MSG_REFERENCE = tmpl_MSG_REFERENCE.replace(
        /#DelvNoteNbr#/g,
        root["CustomerInvoice"][`${k}`]["Item"]["0"][
          "OutboundDeliveryReference"
        ]["ID"]["_value_1"]
      );

      let VATRateCd;
      for (let i = 0; i < root["CustomerInvoice"][`${k}`]["Item"].length; i++) {
        const itemAmount =
          paddingZero(
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "NetAmount"
            ]["_value_1"],
            1,
            2
          ) * 1;
        const taxAmount =
          paddingZero(
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "TaxAmount"
            ]["_value_1"],
            1,
            2
          ) * 1;
        const GrossAmount =
          paddingZero(
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "GrossAmount"
            ]["_value_1"],
            1,
            2
          ) * 1;

        let tmpvatpct;
        for (
          let m = 0;
          m <
          root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
            "PriceComponents"
          ].length;
          m++
        ) {
          if (
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "PriceComponents"
            ][m]["Description"]["_value_1"] === "VAT (%)"
          ) {
            switch (
              root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
                "PriceComponents"
              ][m]["Rate"]["DecimalValue"]
            ) {
              case "20.0":
                ++vatRate20Cnt;
                VATRateCd = "S";
                SubTotItemAmount_LVLA[`${VATRateCd}`] =
                  SubTotItemAmount_LVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotItemAmount_EVLA[`${VATRateCd}`] =
                  ExtSubTotItemAmount_EVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] =
                  ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] + itemAmount;
                VATAmt_VATA[`${VATRateCd}`] =
                  VATAmt_VATA[`${VATRateCd}`] + taxAmount;
                PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] =
                  PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] + GrossAmount;
                break;
              case "5.0":
                ++vatRate5Cnt;
                VATRateCd = "P";
                SubTotItemAmount_LVLA[`${VATRateCd}`] =
                  SubTotItemAmount_LVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotItemAmount_EVLA[`${VATRateCd}`] =
                  ExtSubTotItemAmount_EVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] =
                  ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] + itemAmount;
                VATAmt_VATA[`${VATRateCd}`] =
                  VATAmt_VATA[`${VATRateCd}`] + taxAmount;
                PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] =
                  PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] + GrossAmount;
                break;
              case "0.0":
                ++vatRate0Cnt;
                VATRateCd = "Z";
                SubTotItemAmount_LVLA[`${VATRateCd}`] =
                  SubTotItemAmount_LVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotItemAmount_EVLA[`${VATRateCd}`] =
                  ExtSubTotItemAmount_EVLA[`${VATRateCd}`] + itemAmount;
                ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] =
                  ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`] + itemAmount;
                VATAmt_VATA[`${VATRateCd}`] =
                  VATAmt_VATA[`${VATRateCd}`] + taxAmount;
                PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] =
                  PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`] + GrossAmount;
                break;
            }
            tmpvatpct =
              root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
                "PriceComponents"
              ][m]["Rate"]["DecimalValue"];
          }
        }

        const dstvatpct = paddingZero(tmpvatpct, 2, 3);

        tmpMSG_DETAIL = tmpl_MSG_DETAIL;
        tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
          /#ItemSeqNbr#/g,
          root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["ID"]
        );
        //자제마스터 조회

        // 자제 ID
        // root['CustomerInvoice'][`${k}`]['Item']['0']
        // ['Product']['InternalID']['_value_1'];

        let result2 = await soap(`querymaterials:${MaterialwsdlAlias}`, {
          p12ID: `lghhuktest:${certAlias}`,
          operation: "FindByElements",
          payload: {
            MaterialSelectionByElements: {
              SelectionByInternalID: [
                {
                  InclusionExclusionCode: "I",
                  IntervalBoundaryTypeCode: "1",
                  LowerBoundaryInternalID:
                    root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Product"][
                      "InternalID"
                    ]["_value_1"],
                },
              ],
            },
          },
        });
        result2 = JSON.parse(result2["body"]);
        // result2['Material']['0']['QuantityConversion']
        // ['0']['Quantity']['_value_1']* 1  //환산수량
        for (
          let j = 0;
          j < result2["Material"]["0"]["GlobalTradeItemNumber"].length;
          j++
        ) {
          //확장필드 값이 있으면
          if (
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["EXT008"] !==
              undefined &&
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["EXT008"] !== " "
          ) {
            //송장은 EA이고 원본 오더가 EA가 아니면
            if (
              root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["EXT008"] ===
              result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                "TradingUnitCode"
              ]["_value_1"]
            ) {
              if (
                root["CustomerInvoice"][`${k}`]["Item"]["0"]["Quantity"][
                  "TypeCode"
                ]["_value_1"] === "EA" &&
                root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["EXT008"] !==
                  "EA"
              ) {
                //박스 단위
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeTraded#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#EANCodeConsumer#/g, "");
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInPack#/g,
                  result2["Material"]["0"]["QuantityConversion"]["0"][
                    "Quantity"
                  ]["_value_1"] * 1
                );

                // tmpMSG_DETAIL =
                // tmpMSG_DETAIL.replace(/#QtyInvoiced#/g,
                // root['CustomerInvoice'][`${k}`]['Item']
                // [`${i}`]['Quantity']['Quantity']['_value_1']
                // *1);

                //송장 EA 갯수 / 박스당 EA 갯수
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInvoiced#/g,
                  (root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Quantity"][
                    "Quantity"
                  ]["_value_1"] *
                    1) /
                    (result2["Material"]["0"]["QuantityConversion"]["0"][
                      "Quantity"
                    ]["_value_1"] *
                      1)
                );
                //송장 EA 단가 * 박스당 EA 갯수
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#UnitPrice#/g,
                  paddingZero(
                    root["CustomerInvoice"][`${k}`]["Item"][`${i}`][
                      "PriceAndTax"
                    ]["MainPrice"]["Rate"]["DecimalValue"] *
                      1 *
                      (result2["Material"]["0"]["QuantityConversion"]["0"][
                        "Quantity"
                      ]["_value_1"] *
                        1),
                    0,
                    4
                  )
                );
              } else {
                //개별 단위
                // tmpMSG_DETAIL =
                // tmpMSG_DETAIL.replace(/#EANCodeTraded#/g,
                // '');
                //묶음단위가 ean이 필수다..일단 똑같이 보내본다
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeTraded#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeConsumer#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#QtyInPack#/g, "1");
                //수량
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInvoiced#/g,
                  root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Quantity"][
                    "Quantity"
                  ]["_value_1"] * 1
                );
                // tmpMSG_DETAIL =
                // tmpMSG_DETAIL.replace(/#QtyInvoiced#/g,
                // (root['CustomerInvoice'][`${k}`]['Item']
                // [`${i}`]['Quantity']['Quantity']['_value_1']
                // *1)
                // * (result2['Material']['0']
                // ['QuantityConversion']['0']['Quantity']
                // ['_value_1']* 1));
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#UnitPrice#/g,
                  paddingZero(
                    root["CustomerInvoice"][`${k}`]["Item"][`${i}`][
                      "PriceAndTax"
                    ]["MainPrice"]["Rate"]["DecimalValue"],
                    0,
                    4
                  )
                );
              }
            }
            //확징필드가 없으면
          } else {
            if (
              result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                "TradingUnitCode"
              ]["_value_1"] ===
              root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Quantity"][
                "TypeCode"
              ]["_value_1"]
            ) {
              if (
                root["CustomerInvoice"][`${k}`]["Item"]["0"]["Quantity"][
                  "TypeCode"
                ]["_value_1"] === "XBX"
              ) {
                //박스 단위
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeTraded#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#EANCodeConsumer#/g, "");
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInPack#/g,
                  result2["Material"]["0"]["QuantityConversion"]["0"][
                    "Quantity"
                  ]["_value_1"] * 1
                );

                // root['CustomerInvoice'][`${k}`]['Item']
                // [`${i}`]['Quantity']['Quantity']
                // ['_value_1'] *1)
                // * (result2['Material']['0']
                // ['QuantityConversion']['0']['Quantity']
                // ['_value_1']* 1));
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInvoiced#/g,
                  root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Quantity"][
                    "Quantity"
                  ]["_value_1"] * 1
                );

                //송장 EA 단가 * 박스당 EA 갯수
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#UnitPrice#/g,
                  paddingZero(
                    root["CustomerInvoice"][`${k}`]["Item"][`${i}`][
                      "PriceAndTax"
                    ]["MainPrice"]["Rate"]["DecimalValue"],
                    0,
                    4
                  )
                );
              } else {
                //개별 단위
                // tmpMSG_DETAIL =
                // tmpMSG_DETAIL.replace(/#EANCodeTraded#/g,
                // '');
                // 묶음단위가 ean이 필수다..
                // 일단 똑같이 보내본다.
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeTraded#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#EANCodeConsumer#/g,
                  result2["Material"]["0"]["GlobalTradeItemNumber"][`${j}`][
                    "GlobalTradeID"
                  ]["_value_1"]
                );
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#QtyInPack#/g, "1");
                //수량
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#QtyInvoiced#/g,
                  root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["Quantity"][
                    "Quantity"
                  ]["_value_1"] * 1
                );
                // tmpMSG_DETAIL =
                // tmpMSG_DETAIL.replace(/#QtyInvoiced#/g,
                // (root['CustomerInvoice'][`${k}`]['Item']
                // [`${i}`]['Quantity']['Quantity']['_value_1']
                // *1)
                // * (result2['Material']['0']
                // ['QuantityConversion']['0']['Quantity']
                // ['_value_1']* 1));
                tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
                  /#UnitPrice#/g,
                  paddingZero(
                    root["CustomerInvoice"][`${k}`]["Item"][`${i}`][
                      "PriceAndTax"
                    ]["MainPrice"]["Rate"]["DecimalValue"],
                    0,
                    4
                  )
                );
              }
            }
          }
        }

        // tmpMSG_DETAIL =
        tmpMSG_DETAIL.replace(
          /#UnitPrice#/g,
          paddingZero(
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "MainPrice"
            ]["Rate"]["DecimalValue"],
            0,
            4
          )
        );
        tmpMSG_DETAIL = tmpMSG_DETAIL.replace(
          /#ItemAmount#/g,
          paddingZero(
            root["CustomerInvoice"][`${k}`]["Item"][`${i}`]["PriceAndTax"][
              "NetAmount"
            ]["_value_1"],
            0,
            4
          )
        );
        tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#VATRateCd#/g, VATRateCd);
        tmpMSG_DETAIL = tmpMSG_DETAIL.replace(/#VATRatePct#/g, dstvatpct);

        dstMSG_DETAIL = dstMSG_DETAIL + tmpMSG_DETAIL;
      }

      dstMSG_DETAIL = dstMSG_DETAIL + "</MSG_REF_GROUP>";
      // MSG_SUB_TRAILER
      if (vatRate20Cnt > 0) {
        VATRateCd = "S";
        tmpMSG_SUB_TRAILER = tmpl_MSG_SUB_TRAILER;
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRatePct#/g,
          "20000"
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ItemCount#/g,
          vatRate20Cnt
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#SubTotItemAmount_LVLA#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotItemAmount_EVLA#/g,
          ExtSubTotItemAmount_EVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotAmountIncDisc_ASDA#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATAmt_VATA#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#PayableSubTotAmtIncDisc_APSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_SUB_TRAILER = dstMSG_SUB_TRAILER + tmpMSG_SUB_TRAILER;
      }

      if (vatRate5Cnt > 0) {
        VATRateCd = "P";
        tmpMSG_SUB_TRAILER = tmpl_MSG_SUB_TRAILER;
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRatePct#/g,
          "05000"
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ItemCount#/g,
          vatRate5Cnt
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#SubTotItemAmount_LVLA#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotItemAmount_EVLA#/g,
          ExtSubTotItemAmount_EVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotAmountIncDisc_ASDA#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATAmt_VATA#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#PayableSubTotAmtIncDisc_APSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_SUB_TRAILER = dstMSG_SUB_TRAILER + tmpMSG_SUB_TRAILER;
      }

      if (vatRate0Cnt > 0) {
        VATRateCd = "Z";
        tmpMSG_SUB_TRAILER = tmpl_MSG_SUB_TRAILER;
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATRatePct#/g,
          "00000"
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ItemCount#/g,
          vatRate0Cnt
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#SubTotItemAmount_LVLA#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotItemAmount_EVLA#/g,
          ExtSubTotItemAmount_EVLA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#ExtSubTotAmountIncDisc_ASDA#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#VATAmt_VATA#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_SUB_TRAILER = tmpMSG_SUB_TRAILER.replace(
          /#PayableSubTotAmtIncDisc_APSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_SUB_TRAILER = dstMSG_SUB_TRAILER + tmpMSG_SUB_TRAILER;
      }

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

      //tmpl_MSG_TRAILER

      const InvoiceNetAmount = paddingZero(
        root["CustomerInvoice"][`${k}`]["PriceAndTax"]["NetAmount"]["_value_1"],
        1,
        2
      );
      const InvoiceTaxAmount = paddingZero(
        root["CustomerInvoice"][`${k}`]["PriceAndTax"]["TaxAmount"]["_value_1"],
        1,
        2
      );
      const InvoiceGrossAmount = paddingZero(
        root["CustomerInvoice"][`${k}`]["PriceAndTax"]["GrossAmount"][
          "_value_1"
        ],
        1,
        2
      );

      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#CntSubTrailer#/g,
        vatRateCdCnt
      );
      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#SumSubTotItemAmount_LVLT#/g,
        InvoiceNetAmount
      );
      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#SumExtSubTotItemAmount_EVLT#/g,
        InvoiceNetAmount
      );
      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#SumExtSubTotAmountIncDisc_ASDT#/g,
        InvoiceNetAmount
      );
      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#SumVATAmt_TVAT#/g,
        InvoiceTaxAmount
      );
      tmpl_MSG_TRAILER = tmpl_MSG_TRAILER.replace(
        /#Sum_PayableSubTotAmtIncDisc_TPSI#/g,
        InvoiceGrossAmount
      );

      // tmpl_MSG_VAT_TRAILER
      if (vatRate20Cnt > 0) {
        VATRateCd = "S";
        tmpMSG_VAT_TRAILER = tmpl_MSG_VAT_TRAILER;
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRatePct#/g,
          "20000"
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#ItemCount#/g,
          vatRate20Cnt
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotItemAmount_VSDE#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotAmountIncDisc_VSDI#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileVATAmt_VVAT#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FilePayableSubTotAmtIncDisc_VPSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_VAT_TRAILER = dstMSG_VAT_TRAILER + tmpMSG_VAT_TRAILER;
      }

      if (vatRate5Cnt > 0) {
        VATRateCd = "P";
        tmpMSG_VAT_TRAILER = tmpl_MSG_VAT_TRAILER;
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRatePct#/g,
          "20000"
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#ItemCount#/g,
          vatRate20Cnt
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotItemAmount_VSDE#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotAmountIncDisc_VSDI#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileVATAmt_VVAT#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FilePayableSubTotAmtIncDisc_VPSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_VAT_TRAILER = dstMSG_VAT_TRAILER + tmpMSG_VAT_TRAILER;
      }

      if (vatRate0Cnt > 0) {
        VATRateCd = "Z";
        tmpMSG_VAT_TRAILER = tmpl_MSG_VAT_TRAILER;
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRateCd#/g,
          VATRateCd
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#VATRatePct#/g,
          "20000"
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#ItemCount#/g,
          vatRate20Cnt
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotItemAmount_VSDE#/g,
          SubTotItemAmount_LVLA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileExtSubTotAmountIncDisc_VSDI#/g,
          ExtSubTotAmountIncDisc_ASDA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FileVATAmt_VVAT#/g,
          VATAmt_VATA[`${VATRateCd}`]
        );
        tmpMSG_VAT_TRAILER = tmpMSG_VAT_TRAILER.replace(
          /#FilePayableSubTotAmtIncDisc_VPSI#/g,
          PayableSubTotAmtIncDisc_APSI[`${VATRateCd}`]
        );
        dstMSG_VAT_TRAILER = dstMSG_VAT_TRAILER + tmpMSG_VAT_TRAILER;
      }

      //
      tmpl_FILE_TRAILER = tmpl_FILE_TRAILER.replace(
        /#TotExtSubTotItemAmount_FASE#/g,
        InvoiceNetAmount
      );
      tmpl_FILE_TRAILER = tmpl_FILE_TRAILER.replace(
        /#TotExtSubTotAmountIncDisc_FASI#/g,
        InvoiceNetAmount
      );
      tmpl_FILE_TRAILER = tmpl_FILE_TRAILER.replace(
        /#TotVATAmt_FVAT#/g,
        InvoiceTaxAmount
      );
      tmpl_FILE_TRAILER = tmpl_FILE_TRAILER.replace(
        /#TotPayableSubTotAmtIncDisc_FPSI#/g,
        InvoiceGrossAmount
      );
      tmpl_FILE_TRAILER = tmpl_FILE_TRAILER.replace(/#TotInvoicDetail#/g, "1");

      // tmpl_FILE_TRAILER = tmpl_FILE_TRAILER;

      dstXml =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        "<SAPINVOIC>" +
        tmpl_TRANSMISSION +
        tmpl_FILEHEADER +
        tmpl_MSG_HEADER +
        tmpl_MSG_REFERENCE +
        dstMSG_DETAIL +
        dstMSG_SUB_TRAILER +
        tmpl_MSG_TRAILER +
        dstMSG_VAT_TRAILER +
        tmpl_FILE_TRAILER +
        "</SAPINVOIC>";

      // dstXml = tmpl_MSG_DETAIL;

      // console.log('2===', dstXml);

      // sourceObj = result;

      dstArr[k] = dstXml;
      // draft.response.body.push(dstArr[k]);
    }
  }

  function paddingZero(str, SpadCnt, EpadCnt) {
    str = str + "";
    const a = str.split(".");
    str = a[0].padStart(SpadCnt, "0") + a[1].padEnd(EpadCnt, "0");
    return str;
  }

  // 	  draft.response.body.push(root['CustomerInvoice']
  // ['0']['SellerParty']['StandardID']['0']['_value_1']);
  draft.pipe.json.InvoiceArr = dstArr;
};
