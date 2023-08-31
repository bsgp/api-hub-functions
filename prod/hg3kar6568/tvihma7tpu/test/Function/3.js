module.exports = async (draft, { env, soap }) => {
  const wsdlAlias = "dev";
  const tenantID = env.BYD_TENANT;

  const date = "2023-02-01T00:00:00Z";
  const payload = {
    PurchaseOrderSimpleSelectionByElements: {
      SelectionBySystemAdministrativeDataCreationDateTime: {
        InclusionExclusionCode: "I",
        IntervalBoundaryTypeCode: "8",
        LowerBoundarySystemAdministrativeDataCreationDateTime: date,
      },
    },
    ProcessingConditions: {
      QueryHitsUnlimitedIndicator: false,
    },
  };
  draft.response.body = { payload, wsdlAlias, tenantID };

  let result;
  try {
    result = await soap(`query_purchaseorder:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "FindSimpleByElements",
      payload,
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);

      draft.response.body.E_STATUS = "S";
      draft.response.body.E_MESSAGE = "조회 완료";

      draft.response.body = {
        ...draft.response.body,
        statusCode: result.statusCode,
        body,
      };
    } else throw new Error("soap failed");
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      error: error.message,
      result,
    };
  }
};
