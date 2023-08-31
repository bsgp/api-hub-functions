module.exports = async (draft, { request }) => {
	if (request.path !== "/part-inquiry") {
	    return;
	}
	
	draft.response.body = {
	    info: {
	        agencyName: "PRM 관리자",
	        orderDate: [new Date(), new Date()],
	        processState: "outbound"
	    },
	    rows: [
            // {
                // requestNumber 발주번호
                // orderNumber 주문번호
                // materialNumber 품번
                // partCode 부품코드
                // partDetail 부품내역
                // mainClass 주기종명
                // condition 조건
                // orderQuantity 주문량
                // outboundQuantity 출고량
                // beforeRelease 미출고
                // orderDate 주문일자
                // releaseDate 출고일
                // supplyDate 공급예정일
                // processState 진행상태
            // }
	    ]
	}
}
