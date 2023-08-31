module.exports = async (draft, { request }) => {
	if (request.path !== "/part-code") {
	    return;
	}
	
	draft.response.body = {
	    info: {
	       // modelClass 기종구분
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
}
