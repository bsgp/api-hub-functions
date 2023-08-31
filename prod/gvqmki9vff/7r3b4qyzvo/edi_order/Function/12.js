module.exports = async (draft, { soap }) => {
  const orderArr = draft.pipe.json.SalesOrderArr;
  const productIDs = draft.pipe.json.ProductIDs;
  const isTest = draft.pipe.json.isTest;
  const MaterialwsdlAlias = isTest ? "test4" : "prod1";
  const certAlias = isTest ? "test6" : "prod1";

  // 전체 조회 후 매핑.

  const soapResponse = await soap(`querymaterials:${MaterialwsdlAlias}`, {
    p12ID: `lghhuktest:${certAlias}`,
    operation: "FindByElements",
    payload: {
      MaterialSelectionByElements: {
        SelectionByInternalID: productIDs.map((productID) => {
          return {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryInternalID: productID,
          };
        }),
      },
    },
  });

  const materials = JSON.parse(soapResponse.body);

  for (let orderIdx = 0; orderIdx < orderArr.length; orderIdx++) {
    if (orderArr[orderIdx].isComplete === false) {
      continue;
    }
    const salesOrder = orderArr[orderIdx].SalesOrder;
    for (let itemIdx = 0; itemIdx < salesOrder.Item.length; itemIdx++) {
      const orderItem = salesOrder.Item[itemIdx];

      if (orderItem.ItemProduct.UnitOfMeasure !== "EA") {
        // 			EAN으로 조회해서 result['Material']는 1개만 나온다.
        const fItem = materials.Material.find(
          (item) =>
            item.InternalID._value_1 === orderItem.ItemProduct.ProductInternalID
        );
        if (fItem) {
          const qConversion = fItem.QuantityConversion;
          const fMeasure = qConversion.find(
            (conv) =>
              conv.CorrespondingQuantity.unitCode ===
              orderItem.ItemProduct.UnitOfMeasure
          );
          const quantity = fMeasure.Quantity;
          orderItem.ItemScheduleLine.Quantity =
            Number(orderItem.ItemScheduleLine.Quantity) *
            Number(quantity._value_1);
          orderItem.ItemProduct.UnitOfMeasure = quantity.unitCode;
        }
      }
    }
  }
};
