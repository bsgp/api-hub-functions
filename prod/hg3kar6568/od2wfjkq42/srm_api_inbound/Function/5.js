module.exports = async (draft, { dayjs }) => {
  const { params, IDN_RESULT, GSA_RESULT, IDN_Collection, GSA_Collection } =
    draft.json;
  const { searchType, supplierID } = params;
  const conversion = [];
  try {
    IDN_RESULT.forEach((curr) => {
      if (IDN_Collection === "ItemDocPOCollection?") {
        const header = convIDN_Header(curr.InboundDelivery);
        if (supplierID && supplierID.toUpperCase() !== header.supplier) {
          return;
        }

        curr.InboundDelivery.Item.forEach((idnItem) => {
          const { ID, ItemID } = conv_Ref(idnItem.ItemDocPO);
          conversion.push({
            ...convIDN_Header(curr.InboundDelivery),
            ...convIDN_Item(idnItem),
            purchaseOrderID: ID,
            purchaseOrderItemID: ItemID,
          });
        });
      } else if (searchType === "header") {
        curr.Item.forEach((idnItem) => {
          const { ID, ItemID } = conv_Ref(idnItem.ItemDocPO);
          conversion.push({
            ...convIDN_Header(curr),
            ...convIDN_Item(idnItem),
            purchaseOrderID: ID,
            purchaseOrderItemID: ItemID,
          });
        });
      } else if (searchType === "detail") {
        conversion.push({
          form: {
            ...convIDN_Header(curr),
            po: curr.Item.map((item) => {
              const { ID, ItemID, ...args } = conv_Ref(item.ItemDocPO);
              return {
                ...args,
                purchaseOrderID: ID,
                purchaseOrderItemID: ItemID,
              };
            }),
          },
          list: curr.Item.map((idnItem, idx) => {
            const { ID, ItemID } = conv_Ref(idnItem.ItemDocPO);
            return {
              ...convIDN_Item(idnItem),
              purchaseOrderID: ID,
              purchaseOrderItemID: ItemID,
              index: idx + 1,
            };
          }),
        });
      }
    });
  } catch (err) {
    draft.response.body.catchIDN_Msg = err.message;
  }
  try {
    const getPO = (item) =>
      item.PurchaseOrderItemReference.find((ref) => ref.TypeCode === "001") ||
      {};
    GSA_RESULT.forEach((curr) => {
      if (GSA_Collection === "ReferenceCollection?") {
        const gsaHeader = convGSA_Header(curr.GSA);
        const { supplier, supplierText } = gsaHeader;
        if (supplierID && supplierID.toUpperCase() !== supplier) {
          return;
        }
        if (searchType === "detail") {
          const fIdx = conversion.findIndex(
            (conv) => conv.form.idnID === gsaHeader.idnID
          );

          if (fIdx >= 0) {
            conversion[fIdx].list.push(
              ...curr.GSA.Item.map((gsaItem) => {
                const { ID, ItemID } = conv_Ref(getPO(gsaItem));
                return {
                  ...convGSA_Item(gsaItem),
                  iStockParty: supplier,
                  iStockPartyText: supplierText,
                  purchaseOrderID: ID,
                  purchaseOrderItemID: ItemID,
                };
              })
            );

            conversion[fIdx].list = conversion[fIdx].list
              .sort(function (al, be) {
                return (
                  Number(al.purchaseOrderItemID) -
                  Number(be.purchaseOrderItemID)
                );
              })
              .map((it, idx) => ({
                ...it,
                index: idx + 1,
              }));
          } else
            conversion.push({
              form: {
                ...gsaHeader,
                // po: [...conv_Ref(curr)],
              },
              list: curr.GSA.Item.map((gsaItem, idx) => {
                const { ID, ItemID } = conv_Ref(getPO(gsaItem));
                return {
                  ...convGSA_Item(gsaItem),
                  // ...conv_Ref(getPO(gsaItem)),
                  iStockParty: supplier,
                  iStockPartyText: supplierText,
                  purchaseOrderID: ID,
                  purchaseOrderItemID: ItemID,
                  index: idx + 1,
                };
              }),
            });
        } else {
          curr.GSA.Item.forEach((gsaItem) => {
            const { ID, ItemID } = conv_Ref(getPO(gsaItem));
            conversion.push({
              ...convGSA_Header(curr.GSA),
              ...convGSA_Item(gsaItem),
              purchaseOrderID: ID,
              purchaseOrderItemID: ItemID,
            });
          });
        }
      } else if (searchType === "header") {
        curr.Item.forEach((gsaItem) => {
          const { ID, ItemID } = conv_Ref(getPO(gsaItem));
          conversion.push({
            ...convGSA_Header(curr),
            ...convGSA_Item(gsaItem),
            purchaseOrderID: ID,
            purchaseOrderItemID: ItemID,
          });
        });
      }
    });
  } catch (err) {
    draft.response.body.catchGSA_Msg = err.message;
  }
  draft.json.conversion =
    searchType === "detail"
      ? conversion.map(({ form, list }) => ({
          form: { ...form, barcode: form.idnID },
          list: list.map((it) => ({
            ...it,
            iStockParty: it.iStockParty || form.supplier,
            iStockPartyText: it.iStockPartyText || form.supplierText,
            barcode: [form.idnID, it.purchaseOrderItemID].join("-"),
          })),
        }))
      : conversion;

  function convIDN_Header(hd) {
    const shipToData = hd.ShipTo || {};
    const shipToAddress = shipToData.ShipToAddress;
    const vendorData = hd.VendorParty || {};
    const vendorAddress = vendorData.VendorAddress;
    const arrivalPeriod = hd.ArrivalPeriod || {};
    const recipient = hd.RecipientParty || {};
    const textCollection = Array.isArray(hd.IDNText) ? hd.IDNText : [];
    return {
      objectID: hd.ObjectID,
      idnID: hd.ID,
      barcode: hd.ID,
      creationDate: convDate(dayjs, hd.CreationDateTime),
      status: {
        release: { id: hd.ReleaseStatusCode, text: hd.ReleaseStatusCodeText },
        deliveryProcessing: {
          id: hd.DeliveryProcessingStatusCode,
          text: hd.DeliveryProcessingStatusCodeText,
        },
        cancellation: {
          id: hd.CancellationStatusCode,
          text: hd.CancellationStatusCodeText,
        },
      },
      type: {
        processing: {
          id: hd.ProcessingTypeCode,
          text: hd.ProcessingTypeCodeText,
        },
      },
      processingType: hd.ProcessingTypeCodeText,
      shipTo: shipToData.LocationID,
      shipToText: shipToAddress.FormattedName,
      location: {
        id: shipToData.LocationID,
        text: shipToAddress.FormattedName,
      },
      supplier: vendorData.PartyID,
      supplierText: vendorAddress.FormattedName,
      recipient: recipient.PartyID,
      deliveryDate: convDate(dayjs, arrivalPeriod.StartDateTime),
      desc: textCollection
        .filter((txt) => txt.TypeCode === "10011")
        .map((txt) => txt.Text)
        .join(" "),
    };
  }
  function convIDN_Item(it) {
    const materialData = it.Material || {};
    const iStockData = it.IStock || {};
    const iStockPartyAddress = iStockData.IStockPartyAddress || {};
    const deliveryQtyData = it.DeliveryQuantity || {};
    return {
      itemID: it.ID,
      materialID: it.ProductID,
      materialText: materialData.Description,
      processType: "재고 조달",
      directMaterialIndicator: true,
      iStockID: it.IdentifiedStockID,
      iStockType: {
        id: iStockData.IdentifiedStockTypeCode,
        text: iStockData.IdentifiedStockTypeCodeText,
      },
      iStockParty: iStockData.IStockPartyID,
      iStockPartyText: iStockPartyAddress.FormattedName,
      externalIStockID: iStockData.ExternalIStockID,
      productionDate: convDate(dayjs, iStockData.ProductionDateTime),
      expirationDate: convDate(dayjs, iStockData.ExpirationDateTime),
      deliveryQty: Number(deliveryQtyData.Quantity),
      unit: deliveryQtyData.unitCodeText,
      _unit: deliveryQtyData.unitCode,
    };
  }

  function convGSA_Header(hd) {
    const idnRef = hd.Reference.find((ref) => ref.TypeCode === "73") || {};
    const fparty = hd.Party.find((party) => party.PartyID === hd.PartyID) || {};
    return {
      objectID: hd.ObjectID,
      idnID: idnRef.ID,
      barcode: idnRef.ID,
      documentID: hd.ID,
      creationDate: convDate(dayjs, hd.CreationDateTime),
      deliveryDate: convDate(dayjs, hd.Date),
      status: {
        release: { id: hd.ReleaseStatusCode, text: hd.ReleaseStatusCodeText },
      },
      type: {
        processing: {
          id: hd.ProcessingTypeCode,
          text: hd.ProcessingTypeCodeText,
        },
      },
      processingType: hd.ProcessingTypeCodeText,
      supplier: hd.PartyID,
      supplierText: fparty.PartyAddress && fparty.PartyAddress.FormattedName,
      desc: hd.SRM005_KUT,
      dt: hd.Reference,
    };
  }
  function convGSA_Item(it) {
    const location = it.Location || {};
    return {
      itemID: it.ID,
      materialID: it.ProductID,
      materialText: it.Description,
      processType: "비재고",
      directMaterialIndicator: false,
      shipTo: location.ID,
      shipToText: location.Name,
      deliveryQty: Number(it.Quantity),
      unit: it.unitCodeText,
      _unit: it.unitCode,
    };
  }

  function conv_Ref(item = {}, pad = "") {
    return Object.keys(item).reduce((ref, key) => {
      ref[`${pad}${key}`] = item[key];
      return ref;
    }, {});
  }
};

function convDate(dayjs, dateStr, format = "YYYY-MM-DD") {
  if (!dateStr) {
    return "";
  }
  let date;
  if (typeof dateStr === "string") {
    if (/^\d{1,}$/.test(dateStr)) {
      date = dateStr;
    } else {
      const numberString = dateStr.replace(/^\/Date\(/, "").replace(")/", "");
      if (/^\d{1,}$/.test(numberString)) {
        date = new Date(parseInt(numberString, 10));
      } else date = numberString;
    }
  }
  return dayjs(date).format(format);
}
