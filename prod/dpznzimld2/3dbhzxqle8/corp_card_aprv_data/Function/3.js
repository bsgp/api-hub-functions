module.exports = async (draft, { env, request }) => {
  const routeTo = {
    exit: "Output#2",
    search: "Function#4",
    odata: "Function#5",
    invoice: "Function#6",
    saveInput: "Function#7",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  draft.json.tableConfig = {
    tableName: "CMS_CORP_CARD_APRV_01",
    primaryKeys: ["HIST_ROW_KEY"],
    orderBy: [
      { column: "CARD_NO" },
      { column: "APPR_DATE" },
      { column: "APPR_TIME" },
    ],
  };

  switch (request.method) {
    case "GET": {
      const { mode, odata_entity, ...queries } = request.body;

      if (mode === "odata") {
        if (!odata_entity) {
          setFailedResponse("'odata_entity' is required for OData request");
          return;
        }

        // OData 접속정보 설정
        const { BYD_URL, BYD_ODATA_PATH, BYD_ID, BYD_PW } = env;
        draft.json.requestQuery = {
          odata_entity,
          odata_account: {
            url: [BYD_URL, BYD_ODATA_PATH].join(""),
            id: BYD_ID,
            password: BYD_PW,
          },
          odata_queries: queries,
        };
        draft.json.nextNodeKey = routeTo.odata;
      } else {
        draft.json.requestQuery = request.body;
        draft.json.nextNodeKey = routeTo.search;
      }
      break;
    }
    case "POST": {
      const { companyID, invoiceDate, invDescription, rows } = request.body;

      if (!companyID) {
        setFailedResponse("Parameter 'companyID' is missing");
        return;
      }
      if (!invoiceDate) {
        setFailedResponse("Parameter 'invoiceDate' is missing");
        return;
      }
      if (!invDescription) {
        setFailedResponse("Parameter 'invDescription' is missing");
        return;
      }
      if (!Array.isArray(rows) || rows.length === 0) {
        setFailedResponse("Parameter 'rows' is missing");
        return;
      }

      draft.json.requestData = request.body;
      draft.json.nextNodeKey = routeTo.invoice;
      break;
    }
    case "PATCH": {
      const { rows } = request.body;

      if (!Array.isArray(rows) || rows.length === 0) {
        setFailedResponse("Parameter 'rows' is missing");
        return;
      }

      draft.json.requestData = request.body;
      draft.json.nextNodeKey = routeTo.saveInput;
      break;
    }
    default: {
      setFailedResponse("Check request method and try again");
      return;
    }
  }
};
