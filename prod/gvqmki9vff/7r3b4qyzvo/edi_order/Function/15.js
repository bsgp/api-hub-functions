module.exports = async (draft, { soap }) => {
    
    const wsdlAlias = 'test1';
    const certAlias = 'test4';
    const Mpayload = {SalesOrderSelectionByElements:{
                            SelectionByLastChangedDate : [
                                {
                                    InclusionExclusionCode : 'I',
                                    IntervalBoundaryTypeCode : '3',
                                    LowerBoundaryDateTime : '2021-06-08T05:28:22+09:00',
                                    UpperBoundaryDateTime : '2021-06-10T05:28:22+09:00'
                                }
                            ]
            
                            }
                    };
    
    const result2 = await soap(`querysalesorders:${wsdlAlias}`, {
                p12ID: `lghhuktest:${certAlias}`,
                operation: "FindByElements",
                payload: Mpayload,
            })
	
	draft.response.body = JSON.parse(result2['body']);
	
}
