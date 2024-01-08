// type === "SO" 인 경우 SO,CI,OD,BP 순으로 조회
// type === "CI" 인 경우 CI,OD,SO,BP 순으로 조회
module.exports = async (draft, { lib, odata }) => {
  const { validate, pid, id, type } = draft.pipe.json; // certAlias,
  const { tryit } = lib;
  if (!validate) {
    return;
  }
  const { username, password } = draft.pipe.json;
  let ciID, odID, soID, so, ci, soURL, ciURL, bpURL;
  try {
    if (type === "SO") {
      soURL = getOdataURL(pid, id, type);
      const soData = await odata.get({ url: soURL, username, password });
      so = tryit(() => soData.d.results[0], { DocumentReference: [] });
      const ciRef = so.DocumentReference.find((ref) => ref.TypeCode === "28");
      if (ciRef) {
        ciID = ciRef.ID;
      } else {
        ci = {};
      }
    } else {
      ciID = id;
    }
    if (ciID) {
      ciURL = getOdataURL(pid, ciID, "CI");
      const ciData = await odata.get({ url: ciURL, username, password });
      ci = tryit(() => ciData.d.results[0], {});
    }

    if (type === "CI") {
      // so TypeCode = 118
      const soList = ci.Item.reduce(
        (acc, val) =>
          acc.concat(val.ItemReference.filter((ref) => ref.TypeCode === "114")),
        []
      ).sort((al, be) => Number(al.ID) - Number(be.ID));
      const soID = soList[0].ID;
      soURL = getOdataURL(pid, soID, "SO");
      const soData = await odata.get({ url: soURL, username, password });
      so = tryit(() => soData.d.results[0], {});
    }
    // od TypeCode = 73
    const odList = so.DocumentReference.filter(
      (ref) => ref.TypeCode === "73"
    ).sort((al, be) => Number(al.ID) - Number(be.ID));
    const odIDs = odList.map((od) => od.ID);
    const odURL = getOdataURL(pid, odIDs, "OD");
    console.log("odURL:", odURL);
    const odData = await odata.get({ url: odURL, username, password });
    console.log("odData:", odData);
    const od = tryit(() => odData.d.results, []);

    const parties = so.Party.map((party) => party.PartyID);
    bpURL = getOdataURL(pid, parties, "BP");
    const bpData = await odata.get({ url: bpURL, username, password });
    const bp = tryit(() => bpData.d.results, []);

    draft.pipe.json.so = so;
    draft.pipe.json.ci = ci;
    draft.pipe.json.od = od;
    draft.pipe.json.bp = bp;
    draft.pipe.json.url = { soURL, ciURL, odURL, bpURL };
  } catch (error) {
    draft.pipe.json.validate = false;
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Failed Get Data from BYD",
      error: error.message,
      data: { ciID, odID, soID, so, ci, soURL, ciURL, bpURL, test: "123" },
    };
    draft.response.statusCode = 400;
  }
};

const getOdataURL = (pid, id, service) => {
  let collection, expand;
  if (service === "SO") {
    collection = `bsg_salesorder/SalesOrderCollection`;
    expand = [
      "CashDiscountTerms",
      "ShipToLocation/ShipToLocationPostalAddress",
      "DocumentReference",
      "Party/Address/PostalAddress",
      "Items/Material_V1/MaterialText",
    ].join(",");
  } else if (service === "OD") {
    collection = "bsg_outbounddelivery/OutboundDeliveryCollection";
    expand = [
      "Item/Reference",
      "Item/LogisticsLotMaterial/LogisticsChanges/LogisticsIStock",
      "ShippingPeriod",
      "GAC/GACChangeItem/ODItem",
      "GAC/GACChangeItem/GACIStock",
      "GAC/GACChangeItem/GACQuantity",
    ].join(",");
  } else if (service === "CI") {
    collection = "bsg_customerinvoice/CustomerInvoiceCollection";
    expand = "Item/ItemReference";
  } else if (service === "BP") {
    collection = "bsg_businesspartner/BusinessPartnerCollection";
    expand = "TaxNumber";
  }
  let filter;
  if (Array.isArray(id)) {
    const fKey = service === "BP" ? "InternalID" : "ID";
    filter = id.map((item) => `${fKey} eq '${item}'`).join(" or ");
  } else filter = `ID eq '${id}'`;
  const odataBaseURL = `https://${pid}.sapbydesign.com/sap/byd/odata/cust/v1/`;
  const queryString = [`$expand=${expand}`, `$filter=(${filter})`].join("&");
  return [odataBaseURL, collection, "?", queryString].join("");
};
