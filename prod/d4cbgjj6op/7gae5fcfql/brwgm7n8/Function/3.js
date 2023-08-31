module.exports = async (draft, { request }) => {
	if (request.path !== "/register-order") {
	    return;
	}
	
	const { type } = draft.pipe.json;
	switch (type) {
	    case "END":
	        draft.response.body = {
        	    info: {
        	        dealLimit: 0,
        	        usedMoney: 0,
        	        useableMoney: 0
        	    },
        	    rows: [
        	        {
        	            productCode: "SZ2A-1101-TS",
        	            productDetail: "SV250;;;티탄은색",
        	            price: 4275975,
        	            unit: "EA"
        	        }
        	    ]
        	}
	        break;
	    case "PART":
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
	        break;
        default:
            break;
	}
}
