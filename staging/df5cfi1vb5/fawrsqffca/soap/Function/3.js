module.exports = async (draft, { soap }) => {
	const result = await soap("queryproductionlotisiin:dev", {
      p12ID: "my349266_p12:dev",
      operation: "FindByElements",
      payload: {
          ProductionLotSelectionByElements: {
            SelectionByProductionOrderID: [
              {
                InclusionExclusionCode: 'I',
                IntervalBoundaryTypeCode: '1',
                LowerBoundaryProductionOrderID: '39148',
              },
            ],
          },
        }
  })
  draft.response = result;
}
