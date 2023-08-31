module.exports = async (draft, { soap }) => {
  const orderArr = draft.pipe.json.SalesOrderArr;
  const productIDs = draft.pipe.json.ProductIDs;
  const isTest = draft.pipe.json.isTest;
  const MaterialwsdlAlias = isTest ? "test4" : "prod2";
  // const certAlias = isTest ? "test10" : "prod2";
  const tenantID = isTest ? "my356725" : "my357084";

  // 전체 조회 후 매핑.
  let materials;
  if (productIDs && productIDs.length > 0) {
    const soapResponse = await soap(`querymaterials:${MaterialwsdlAlias}`, {
      // p12ID: `lghhuktest:${certAlias}`,
      tenantID,
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
    materials = JSON.parse(soapResponse.body);
    // draft.response.body.push({ productIDs, soapResponse });
  } else materials = [];

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
          /** 단위환산 로직 수정 (23.08.02) */
          const fConversion = qConversion.find(
            (conv) =>
              (conv.CorrespondingQuantity.unitCode === "EA" &&
                conv.Quantity.unitCode ===
                  orderItem.ItemProduct.UnitOfMeasure) ||
              (conv.CorrespondingQuantity.unitCode ===
                orderItem.ItemProduct.UnitOfMeasure &&
                conv.Quantity.unitCode === "EA")
          );
          if (!fConversion) {
            const materialID = orderItem.ItemProduct.ProductInternalID;
            orderArr[orderIdx].isComplete = false;
            orderArr[orderIdx].errorCode.push(materialID);
            orderArr[orderIdx].errorDescription.push(
              [
                "Material Conversion not exist:",
                materialID,
                `(${orderItem.ItemProduct.UnitOfMeasure})`,
              ].join(" ")
            );
            continue;
          }
          let fMeasure;
          if (fConversion && fConversion.Quantity.unitCode === "EA") {
            const { _value_1, unitCode } = fConversion.Quantity;
            const sourceValue = fConversion.CorrespondingQuantity._value_1;
            const newValue = Math.round((_value_1 / sourceValue) * 1000) / 1000;
            fMeasure = { Quantity: { _value_1: newValue, unitCode } };
          } else if (
            fConversion &&
            fConversion.CorrespondingQuantity.unitCode === "EA"
          ) {
            const { _value_1, unitCode } = fConversion.CorrespondingQuantity;
            const sourceValue = fConversion.Quantity._value_1;
            const newValue = Math.round((_value_1 / sourceValue) * 1000) / 1000;
            fMeasure = { Quantity: { _value_1: newValue, unitCode } };
          }
          const quantity = fMeasure.Quantity;
          orderItem.ItemScheduleLine.Quantity =
            Number(orderItem.ItemScheduleLine.Quantity) *
            Number(quantity._value_1);
          orderItem.ItemProduct.UnitOfMeasure = quantity.unitCode;
        }
      }
    }
  }
  draft.response.body.push(orderArr);
};
