module.exports = async (draft, { soap, lib }) => {
  const { tryit } = lib;
  const { pid, inventoryList } = draft.pipe.json;
  const body = draft.response.body;
  const alias = {
    my358322: {
      certAlias: "dmtest1",
      goodsWsdlAlias: "test1",
    },
    my359276: {
      certAlias: "dmprod1",
      goodsWsdlAlias: "prod1",
    },
  };
  const certAlias = alias[pid].certAlias;
  const goodsWsdlAlias = alias[pid].goodsWsdlAlias;

  const mList = [];
  if (inventoryList.length > 0) {
    body.count = inventoryList.length;
    inventoryList.forEach((inv, idx) => {
      const product = inv.CISTOCK_UUID.split("/");
      const area = inv.CLOG_AREA_UUID.split("/");
      const cList = {
        OwnerPartyInternalID: "LGHNH_DR",
        SourceMaterialInternalID: product[0],
        SourceIdentifiedStockID: product[1],
        SourceLogisticsAreaID: area[1], //
        TargetMaterialInternalID: product[0],
        TargetInventoryRestrictedUseIndicator: true,
        TargetIdentifiedStockID: product[1],
        TargetLogisticsAreaID: area[1].replace(/_2/, ""), //
      };
      const InventoryItemChangeQuantity = {
        Quantity: { unitCode: inv.CON_HAND_STOCK_UOM },
        QuantityTypeCode: inv.CON_HAND_STOCK_UOM,
      };
      if (Number(inv.KCQUALITY_STOCK) > 0) {
        InventoryItemChangeQuantity.Quantity._value_1 = inv.KCQUALITY_STOCK;
        mList.push({
          ...cList,
          ExternalItemID: `C${idx}`,
          SourceInventoryRestrictedUseIndicator: false,
          SourceInventoryStockStatusCode: "1",
          TargetInventoryRestrictedUseIndicator: false,
          TargetInventoryStockStatusCode: "1",
          InventoryItemChangeQuantity,
        });
      }
      if (Number(inv.KCRESTRICTED_STOCK) > 0) {
        InventoryItemChangeQuantity.Quantity._value_1 = inv.KCRESTRICTED_STOCK;
        mList.push({
          ...cList,
          ExternalItemID: `R${idx}`,
          SourceInventoryRestrictedUseIndicator: true,
          InventoryItemChangeQuantity,
        });
      }
      if (Number(inv.KCUN_RESTRICTED_STOCK) > 0) {
        InventoryItemChangeQuantity.Quantity._value_1 =
          inv.KCUN_RESTRICTED_STOCK;
        mList.push({
          ...cList,
          ExternalItemID: `U${idx}`,
          SourceInventoryRestrictedUseIndicator: false,
          InventoryItemChangeQuantity,
        });
      }
    });
  }
  const InventoryChangeItemGoodsConsumptionInformationForChangeOfStock = mList;
  if (mList.length > 0) {
    const payload = {
      GoodsAndActivityConfirmation: {
        ExternalID: "1",
        SiteID: "DO03",
        InventoryChangeItemGoodsConsumptionInformationForChangeOfStock,
      },
    };
    body.payload = payload;
    try {
      const changeStock = await soap(`goodsconfirmation:${goodsWsdlAlias}`, {
        p12ID: `p12key:${certAlias}`,
        tenantID: pid,
        operation: "DoGoodsChangeOfStock",
        payload,
      });
      if (changeStock.statusCode === 200) {
        const changeStockResult = JSON.parse(changeStock.body);
        const changeStockResponse = changeStockResult.GACDetails[0];
        body.changeStockResult = changeStockResult;
        const GACID = tryit(() => changeStockResponse.GACID._value_1, "");
        if (!GACID) {
          const logs = tryit(() => changeStockResult.Log, {});
          body.E_STATUS = "E";
          body.E_MESSAGE = "Error Occurred";
          body.E_DESCRIPTION = logs;
        } else {
          body.E_STATUS = "S";
          body.E_MESSAGE = "Saved Successfully";
          body.GACID = GACID;
        }
      } else {
        body.changeStockResult = changeStock;
        body.E_STATUS = "E";
        body.E_MESSAGE = "Error Occurred(status not 200)";
      }
    } catch (error) {
      body.E_STATUS = "E";
      body.E_MESSAGE = "Error Occurred(request failed)";
      body.E_DESCRIPTION = error.message;
    }
  } else {
    body.E_STATUS = "S";
    body.E_MESSAGE = "Not exist change stock";
    body.targetLogisticsArea = draft.pipe.json.targetLogisticsArea;
  }
};
