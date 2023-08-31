module.exports = async (draft, { request }) => {
	if (request.path !== "/end-register") {
	    return;
	}
	
	draft.response.body = {
	    params: request.params,
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
}
