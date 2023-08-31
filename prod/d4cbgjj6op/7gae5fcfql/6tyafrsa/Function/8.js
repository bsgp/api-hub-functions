module.exports = async (draft, { request }) => {
	if (request.path !== "/end-return") {
	    return;
	}
	
	draft.response.body = {
	    info: {
	        agencyName: "PRM 관리자",
	        // sumMoney,
	        orderDate: [new Date(), new Date()],
	        processState: "part"
	    },
	    rows: [
	       // {
	       //     orderNumber 주문번호
	       //     productClass 품목
	       //     productCode 제품코드
	       //     productDetail 제품내역
	       //     returnQuantity 반품수량
	       //     inboundQuantity 입고량
	       //     beforeInbound 미입고량
	       //     returnDate 반품일자
	       //     inboundDate 입고일
	       //     returnMoney 반품금액
	       //     processState 진행상태
	       // }
	    ]
	}
}
