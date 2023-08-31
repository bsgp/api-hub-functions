module.exports = async (draft, {soap}) => {
    // const result = await soap("querymaterials:test", {
    //     p12ID: "lghhuktest:test4",
    //     operation: "FindByElements",
    //     payload: {
    //         // MaterialByElementsQuery_sync:{
    //             MaterialSelectionByElements:{
    //                     SelectionByInternalID:[
    //                         {
    //                             InclusionExclusionCode:'I',
    //                             IntervalBoundaryTypeCode:'1',
    //                             LowerBoundaryInternalID:'18230635'
    //                         },
    //                     ],
    //             },
    //         // },
    //       }
    // })
    const result = await soap("querysalesorders:test2", {
        p12ID: "lghhuktest:test4",
        operation: "FindByElements",
        payload: {
            // MaterialByElementsQuery_sync:{
                SalesOrderSelectionByElements:{
                        SelectionByID:[
                            {
                                InclusionExclusionCode:'I',
                                IntervalBoundaryTypeCode:'1',
                                LowerBoundaryID:'368'
                            },
                        ],
                },
            // },
          }
    })
    
    
    const a = JSON.parse(result['body']);
    draft.response.body = a['SalesOrder']['0']['BuyerID']['_value_1'];
    // 
  }