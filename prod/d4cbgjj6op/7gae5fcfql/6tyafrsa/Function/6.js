module.exports = async (draft, { request }) => {
	if (request.path !== "/part-register") {
	    return;
	}
	
	draft.response.body = {
	    info: {
	       // orderNumber
	       sumMoney: 33000,
	       dealLimit: 111,
	       usedMoney: 20,
	       useableMoney: 67
	    },
	    rows: [
	        {
                modelClass: "ACC",
                partCode: "COMM-32AS-BK",
                agencyPrice: 33000,
                orderAmount: 1,
                price: 33000,
                duplication: "N"
            }
        ]
	};
}
