module.exports = async (draft, { request }) => {
	if (request.path !== "/inquire-code") {
	    return;
	}
	
	const { type } = draft.pipe.json;
	switch (type) {
	    case "END":
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
	        break;
	    case "PART":
	        draft.response.body = {
        	    info: {
        	        //     modelClass 기종구분
                    //     partCode 부품코드
                    //     exPartCode 구부품코드
                    //     partDetail 부품내역
        	    },
        	    rows: [
                    // {
                    //     modelClass 기종구분
                    //     petName PET NAME (애칭)
                    //     partClass 부품구분
                    //     partCode 부품코드
                    //     productDetail 부품내역
                    //     exPartCode 구부품코드
                    //     minOrderQuantity 최소주문량
                    //     agencyPrice 대리점가
                    //     orderQuantity 주문량
                    //     inventory 재고
                    //     note 비고
                    // }
                    {
                        modelClass: "ACC",
                        partCode: "COMM-32AS-BK",
                        productDetail: "멀티백 32리터 A TYPE(검정색)",
                        agencyPrice: 33000,
                        note: "화성정밀"
                    },
                    {
                        modelClass: "ACC",
                        partCode: "COMM-32AS-GY",
                        productDetail: "멀티백 32리터 A TYPE(회색)",
                        agencyPrice: 33000,
                        note: "화성정밀"
                    },
                    {
                        modelClass: "ACC",
                        partCode: "COMM-38AD-RD",
                        productDetail: "멀티백 38리터 A TYPE(적색, LED 부착)",
                        agencyPrice: 119900,
                        note: "화성정밀"
                    }
        	    ]
        	}
	        break;
        default:
            break;
	}
}
