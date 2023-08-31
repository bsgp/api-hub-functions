module.exports = async (draft, { file, lib, log }) => {
  const parseString = require("xml2js").parseString;
  const fullPathList = draft.pipe.json.fullPathList;
  const { tryit } = lib;
  const EANs = [];
  for (let pathIdx = 0; pathIdx < fullPathList.length; pathIdx++) {
    try {
      let order;
      const txt = await file.get(fullPathList[pathIdx], { gziped: true });
      await parseString(txt, function (err, result2) {
        if (err) {
          log(err);
        }
        order = result2;
      });

      // odata로 gln조회해서 매핑해야함. order.SAPORDER.TRANSMISSION.SenderID
      // gnl 넣고 다음 펑션에서 바꾼다
      const transmission = order.SAPORDER.TRANSMISSION["0"];
      const msgGroup = order.SAPORDER.MSG_GROUP;
      const fileHeader = tryit(() => order.SAPORDER.FILE_HEADER["0"], {});
      const supplierAsignNbr = tryit(() => fileHeader.SupplierAsignNbr["0"]);
      const fh_customerID = tryit(() => fileHeader.CustomerID["0"]);
      const customerID = transmission.SenderID["0"];
      const sender =
        tryit(() => transmission.SenderNM["0"], "") ||
        tryit(() => fileHeader.CustomerName["0"], "") ||
        customerID;

      const salesOrderData = {
        fullPath: fullPathList[pathIdx],
        refIDs: [],
        sender,
        errorCode: [],
        errorDescription: [],
        isComplete: true,
      };

      msgGroup.forEach((msg) => {
        const msgHeader = msg.MSG_HEADER["0"];
        const msgDetail = msg.MSG_DETAIL;
        const day = msgHeader.EarliestDelvDate.toString();
        // time 값이 없을 수 있음.
        const times = tryit(
          () => msgHeader.EarliestArrivalTime.toString(),
          "0000"
        );
        const cDate = [
          `20${day.substr(0, 2)}-${day.substr(2, 2)}-${day.substr(4, 2)}`,
          `${times.substr(0, 2)}:${times.substr(2)} utc `,
        ].join(" ");
        // posting 데이트를 요청일자와 같게 처리 20210701 조이사님 요청
        const currTime = new Date(cDate).toISOString();
        const Name = tryit(() => fileHeader.FileGenNbr["0"], undefined);
        const BuyerID = `PO_${msgHeader.PONbr["0"]}`;
        salesOrderData.refIDs.push(BuyerID);

        const SalesOrder = {
          PostingDate: currTime,
          AccountParty: { PartyID: customerID },
          BillToParty: { PartyID: customerID },
          ProductRecipientParty: { PartyID: msgHeader.CustomerID["0"] },
          BuyerID,
          Name,
          ReleaseCustomerRequest: "true",
          DeliveryTerms: { DeliveryPriorityCode: "3" },
          Item: [],
          RequestedFulfillmentPeriodPeriodTerms: {
            StartDateTime: { _value_1: currTime, timeZoneCode: "UTC" },
          },
          EXT001: supplierAsignNbr,
          EXT019: fh_customerID,
          EXT007: tryit(() => msgHeader.DelvInstructNbr["0"], ""),
          EXT027: tryit(() => msgHeader.DelvInstruct1["0"], ""),
        };
        // 오류 기록을 위해 고객명 저장
        draft.pipe.json.CustomerName.push(sender);
        // 오류 기록을 위해 ship to 이름 저장
        const customer = tryit(() => msgHeader.CustomerName["0"], "");
        draft.pipe.json.ShiptoName.push(customer);

        if (transmission.PriorityCd) {
          switch (transmission.PriorityCd) {
            case "A":
              SalesOrder.DeliveryTerms.DeliveryPriorityCode = "2";
              break;
            case "B":
              SalesOrder.DeliveryTerms.DeliveryPriorityCode = "3";
              break;
            case "C":
              SalesOrder.DeliveryTerms.DeliveryPriorityCode = "7";
              break;
            default:
              break;
          }
        }
        // SalesOrder Items
        for (let itemIdx = 0; itemIdx < msgDetail.length; itemIdx++) {
          // tmpItem = tmplItem;
          const currItem = msgDetail[itemIdx];
          const EANCode = tryit(() => currItem.EANCodeTraded["0"], "");
          const DUNSCode = tryit(() => currItem.DUNSCodeTraded["0"], "");
          // waitrose ean code not allocated issue fix 22.11.09
          const suppProdCd = tryit(() => currItem.SuppProdCdTraded["0"], "");

          // const EAN = EANCode || DUNSCode || suppProdCd;
          const EAN = EANCode || DUNSCode || suppProdCd;
          const soItem = {
            ID: currItem.ItemSeqNbr["0"],
            ItemProduct: { ProductInternalID: "", UnitOfMeasure: "" },
            ItemScheduleLine: { Quantity: "" },
            EXT008: "",
            EXT028: EAN,
          };
          if (EAN) {
            // Sainsbury: 5010011900016 Morrison: 5013546229809
            // let pEAN;
            // if (["5010011900016", "5013546229809"].includes(customerID)) {
            //   pEAN = EAN.length > 13 ? EAN.substring(1) : EAN;
            //   soItem.EXT028 = pEAN;
            // } else pEAN = EAN;
            // soItem.ItemProduct.ProductInternalID = pEAN;
            soItem.ItemProduct.ProductInternalID = EAN;
            soItem.ItemScheduleLine.Quantity = currItem.QtyOrdered["0"];
            // EANs.push(pEAN);
            EANs.push(EAN);
          } else {
            soItem.ItemProduct.ProductInternalID = currItem.EANCodeConsumer;
            // 개당주문의 경우 팩당 수량 안올듯.. * (currItem.QtyInPack*1);
            soItem.ItemScheduleLine.Quantity = currItem.QtyOrdered * 1;
          }
          SalesOrder.Item.push(soItem);
        }
        draft.pipe.json.SalesOrderArr.push({ ...salesOrderData, SalesOrder });
        draft.pipe.json.isComplete.push(true);
      });
    } catch (err) {
      draft.response.body.push({ err: err.message });
    }
  }
  draft.pipe.json.EAN = EANs.filter(
    (id, idx) => EANs.findIndex((item) => item === id) === idx
  );
  // draft.response.body.push({
  //   ean: draft.pipe.json.EAN,
  //   so: draft.pipe.json.SalesOrderArr
  // });
};
