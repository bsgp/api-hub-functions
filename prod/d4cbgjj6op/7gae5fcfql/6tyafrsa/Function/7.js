module.exports = async (draft, { request }) => {
	if (request.path !== "/product-add") {
	    return;
	}
	
	draft.response.body = {
	    info: {},
	    rows: [
	        {
              modelClass: "SV250",
              petName: "큐3",
              productCode: "SZ2A-1101-TS",
              productDetail: "SV250;;;티탄은색",
              unit: "EA",
              price: 4275975,
              currency: "KRW"
            },
            {
              modelClass: "SV250",
              petName: "큐3",
              productCode: "SZ2A-1101-WL",
              productDetail: "SV250;;;금백색",
              unit: "EA",
              price: 4275975,
              currency: "KRW"
            },
            {
              modelClass: "XQ250",
              petName: "엑스큐250",
              productCode: "SZ3N-1801-GT",
              productDetail: "XQ250;;;암회색",
              unit: "EA",
              price: 4540000,
              currency: "KRW"
            }
	    ]
	};
}
