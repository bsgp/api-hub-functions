module.exports = async (draft, { file, lib, log }) => {
  const parseString = require("xml2js").parseString;
  const fullPathList = draft.pipe.json.fullPathList;
  const { tryit } = lib;
  const EANs = [];
  for (let soIdx = 0; soIdx < fullPathList.length; soIdx++) {
    // 단건 테스트용
    try {
      let order;
      const txt = await file.get(fullPathList[soIdx], { gziped: true });
      const parseresult = await parseString(txt, function (err, result2) {
        if (err) {
          log(err);
        }
        order = result2;
      });

      log(parseresult);

      // odata로 gln조회해서 매핑해야함. order.SAPORDER.TRANSMISSION.SenderID
      // gnl 넣고 다음 펑션에서 바꾼다
      const transmission = order.SAPORDER.TRANSMISSION["0"];
      const msgGroup = order.SAPORDER.MSG_GROUP;
      const fileHeader = tryit(() => order.SAPORDER.FILE_HEADER["0"], {});

      const supplierAsignNbr = tryit(() => fileHeader.SupplierAsignNbr["0"]);
      const fh_customerID = tryit(() => fileHeader.CustomerID["0"]);

      msgGroup.forEach((msg) => {
        const msgHeader = msg.MSG_HEADER["0"];
        const msgDetail = msg.MSG_DETAIL;
        const customerID = transmission.SenderID["0"];
        const day = msgHeader.EarliestDelvDate.toString();
        // 시간 옵션이라 없을 수 있음.
        const times = tryit(
          () => msgHeader.EarliestArrivalTime.toString(),
          "0000"
        );
        const cDate = [
          `20${day.substr(0, 2)}-${day.substr(2, 2)}-${day.substr(4, 2)}`,
          `${times.substr(0, 2)}:${times.substr(2)} utc `,
        ].join(" ");
        const Name = tryit(() => fileHeader.FileGenNbr["0"], undefined);

        const SalesOrder = {
          PostingDate: new Date(cDate).toISOString(),
          // posting 데이트를 요청일자와 같게 처리 20210701 조이사님 요청
          AccountParty: { PartyID: customerID },
          BillToParty: { PartyID: customerID },
          ProductRecipientParty: { PartyID: msgHeader.CustomerID["0"] },
          BuyerID: `PO_${msgHeader.PONbr["0"]}`,
          Name,
          ReleaseCustomerRequest: "true",
          DeliveryTerms: { DeliveryPriorityCode: "3" },
          Item: [],
          RequestedFulfillmentPeriodPeriodTerms: {
            StartDateTime: {
              _value_1: new Date(cDate).toISOString(),
              timeZoneCode: "UTC",
            },
          },
          EXT001: supplierAsignNbr,
          EXT019: fh_customerID,
          EXT007: tryit(() => msgHeader.DelvInstructNbr["0"], ""),
          EXT027: tryit(() => msgHeader.DelvInstruct1["0"], ""),
        };
        // 오류 기록을 위해 고객명 저장
        const sender = tryit(() => transmission.SenderNM["0"], "");
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
          const suppProdCd = tryit(() => currItem.SuppProdCdTraded["0"], "");
          const DUNSCode = tryit(() => currItem.DUNSCodeTraded["0"], "");

          const EAN = EANCode || suppProdCd || DUNSCode;
          const soItem = {
            ID: currItem.ItemSeqNbr["0"],
            ItemProduct: { ProductInternalID: "", UnitOfMeasure: "" },
            ItemScheduleLine: { Quantity: "" },
            EXT008: "",
            EXT028: EAN,
          };
          if (EAN) {
            soItem.ItemProduct.ProductInternalID = soItem.EXT028;
            soItem.ItemScheduleLine.Quantity = currItem.QtyOrdered["0"];
          } else {
            soItem.ItemProduct.ProductInternalID = currItem.EANCodeConsumer;
            // 개당주문의 경우 팩당 수량 안올듯.. * (currItem.QtyInPack*1);
            soItem.ItemScheduleLine.Quantity = currItem.QtyOrdered * 1;
          }
          EANs.push(EAN);
          SalesOrder.Item.push(soItem);
        }

        draft.pipe.json.SalesOrderArr.push({
          SalesOrder,
          isComplete: true,
          fullPath: fullPathList[soIdx],
        });

        draft.pipe.json.isComplete.push(true);
      });
    } catch (err) {
      log(err);
      draft.response.body.push({ err: err.message });
    }
  }
  draft.pipe.json.EAN = EANs.filter(
    (id, idx) => EANs.findIndex((item) => item === id) === idx
  );
};
