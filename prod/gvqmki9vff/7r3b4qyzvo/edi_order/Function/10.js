module.exports = async (draft, { soap }) => {
    
    let wsdlAlias;
    let certAlias;
    
    draft.response.body = [];
    
    // if(draft.pipe.json.isTest){
    if(true){
        wsdlAlias = 'test1';
        certAlias = 'test4';
    }else{
        wsdlAlias = 'prod1';
        certAlias = 'prod1';
    }
    
    let soapPayload = {
            "BasicMessageHeader":{},
            "SalesOrder": {
            "AccountParty": {
                "PartyID": "C4001"
            },
            "BillToParty": {
                "PartyID": "C4001"
            },
            "BuyerID": "test12345684",
            "Name": "8316",
            "ReleaseCustomerRequest": "true",
            "DeliveryTerms": {
                "DeliveryPriorityCode": "3"
            },
            "Item": [
                {
                    "ID": "1",
                    "ItemProduct": {
                        "ProductInternalID": "18230625",
                        "UnitOfMeasure": "XBX"
                    },
                    "ItemScheduleLine": {
                        "Quantity": "10"
                    }
                },
                {
                    "ID": "2",
                    "ItemProduct": {
                        "ProductInternalID": "18230635",
                        "UnitOfMeasure": "XBX"
                    },
                    "ItemScheduleLine": {
                        "Quantity": "20"
                    }
                }
            ],
            "RequestedFulfillmentPeriodPeriodTerms": {
                "StartDateTime": {
                    "_value_1": "2021-06-01T18:00:00Z",
                    "timeZoneCode": "UTC"
                    }
                }
            }
        }
    
	const result = await soap(`manage_sales_orders:${wsdlAlias}`, {
        p12ID: `lghhuktest:${certAlias}`,
        operation: "MaintainBundle",
        payload: soapPayload,
    });
    
    draft.response.body.push(result);
    
};