module.exports = async (draft, { request }) => {
	if (request.path !== "/end-inquiry") {
	    return;
	}
	
	draft.response.body = {
	    info: {
	        agencyName: "PRM 관리자",
	        // sumQuantity
	        // sumMoney
	        orderDate: [new Date(), new Date()],
	        processState: "part"
	    },
	    rows: []
	};
}
