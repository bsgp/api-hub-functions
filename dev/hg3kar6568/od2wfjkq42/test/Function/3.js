module.exports = async (draft, { soap }) => {
  let result;
  try {
    result = await soap(`query_material:dev`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID: "my430552",
      operation: "FindByElements",
      payload: {
        MaterialSelectionByElements: {
          SelectionByLastChangeSinceDateTime: "2023-04-01T00:00:00Z",
        },
        ProcessingConditions: {
          QueryHitsUnlimitedIndicator: false,
        },
      },
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body) || [{}];
      draft.json.result = body.Material[0];
      draft.response.body = {
        statusCode: result.statusCode,
        body,
        po: body.Material[0],
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
