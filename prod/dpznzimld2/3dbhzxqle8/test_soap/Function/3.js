module.exports = async (draft, { env, request, soap }) => {
  const routeTo = {
    exit: "Output#2",
    update: "Function#7",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { id } = request.body;
  if (typeof id !== "string" || !id) {
    setFailedResponse("id 를 string 형태로 입력하세요");
    return;
  }

  const { BYD_TENANT, SOAP_ID_QUERY, SOAP_PASSWORD } = env;
  const payload = {
    SupplierInvoiceSimpleSelectionByElements: {
      SelectionByID: {
        InclusionExclusionCode: "I",
        IntervalBoundaryTypeCode: "1",
        LowerBoundaryID: id,
      },
    },
    ProcessingConditions: {
      QueryHitsUnlimitedIndicator: true,
    },
  };

  const { statusCode, body } = await soap("query_supplier_invoices:main", {
    tenantID: BYD_TENANT,
    username: SOAP_ID_QUERY,
    password: SOAP_PASSWORD,
    operation: "FindSimpleByElements",
    payload,
  });

  draft.response.body = {
    statusCode,
    body: JSON.parse(body),
  };
  draft.json.nextNodeKey = routeTo.exit;
};
