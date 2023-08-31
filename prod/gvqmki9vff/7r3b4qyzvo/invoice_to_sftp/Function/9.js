// set isExist, CBP_UUIDs, material, salesorder, outbounddelivery for request
module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const root = draft.pipe.json.Invoices;
  const ci = root.CustomerInvoice;

  if (ci && ci.length > 0) {
    draft.pipe.json.isExist = true;
  } else {
    draft.pipe.json.isExist = false;
    return;
  }

  let CBP_UUIDs = [],
    materialIDs = [],
    salesOrders = [],
    outboundDeliverys = [];

  ci.forEach((inv) => {
    const itemCommon = inv.Item["0"];
    const CBP_UUID1 = inv.BuyerParty.PartyID._value_1;
    CBP_UUIDs.push(CBP_UUID1);
    const CBP_UUID2 = itemCommon.ProductRecipientParty.PartyID._value_1;
    CBP_UUIDs.push(CBP_UUID2);
    inv.Item.forEach((item) => {
      const materialID = tryit(() => item.Product.InternalID._value_1);
      const salesOrderID = tryit(() => item.SalesOrderReference.ID._value_1);
      const odID = tryit(() => item.OutboundDeliveryReference.ID._value_1);
      materialIDs.push(materialID);
      salesOrders.push(salesOrderID);
      outboundDeliverys.push(odID);
    });
  });
  CBP_UUIDs = CBP_UUIDs.filter((uuid, idx) => CBP_UUIDs.indexOf(uuid) === idx);
  materialIDs = materialIDs
    .filter(Boolean)
    .filter((id, idx) => materialIDs.indexOf(id) === idx);
  salesOrders = salesOrders
    .filter(Boolean)
    .filter((id, idx) => salesOrders.indexOf(id) === idx);
  outboundDeliverys = outboundDeliverys
    .filter(Boolean)
    .filter((id, idx) => outboundDeliverys.indexOf(id) === idx);

  draft.pipe.json.CBP_UUIDs = CBP_UUIDs;
  draft.pipe.json.materialIDs = materialIDs;
  draft.pipe.json.salesOrders = salesOrders;
  draft.pipe.json.outboundDeliverys = outboundDeliverys;

  // draft.response.body = { CBP_UUIDs, salesOrders, outboundDeliverys };
};
