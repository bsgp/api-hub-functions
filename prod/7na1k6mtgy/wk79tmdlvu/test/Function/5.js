module.exports = async (draft, { soap }) => {
  const wsdlAlias = "test1";
  const certAlias = "test12";
  const tenantID = "my341545";
  const payload = {
    MaterialSelectionByElements: {
      SelectionByInternalID: {
        InclusionExclusionCode: "I",
        IntervalBoundaryTypeCode: "1",
        LowerBoundaryInternalID: "880",
      },
    },
    ProcessingConditions: {
      QueryHitsUnlimitedIndicator: false,
    },
  };
  draft.response.body = { payload, wsdlAlias, certAlias };

  let result;
  try {
    result = await soap(`querymaterialin:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "FindByElements",
      payload,
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      draft.response.body = {
        // ...draft.response.body,
        // statusCode: result.statusCode,
        ...body,
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
