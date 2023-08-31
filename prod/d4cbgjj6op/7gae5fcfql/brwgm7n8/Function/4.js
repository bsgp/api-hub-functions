module.exports = async (draft, { request }) => {
	if (request.path !== "/inquire-order") {
	    return;
	}
	
	const { type } = draft.pipe.json;
	switch (type) {
	    case "ORDER_END":
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
	        break;
	    case "ORDER_PART":
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
	        break;
	    case "RETURN_END":
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
	        break;
        default:
            break;
	}
}
