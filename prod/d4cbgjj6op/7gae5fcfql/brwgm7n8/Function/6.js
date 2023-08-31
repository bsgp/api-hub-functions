module.exports = async (draft, { request }) => {
    if (request.path !== "/free-service") {
        return;
    }

	draft.response.body = {
	    basicInfo: {
	        phoneNumber: "010-3665-7802",
	        email: "bgkang@bsgglobal",
	        customerName: "천세영",
	        customerNumber: "80000000",
	        postalCode: "04274",
	        mobileNumber: "02-1234-4321",
	        address: "서울특별시 성동구 금호산길 27.102/703(금호동..."
	    },
	    customerInfo: {
	        customerType: ["03", "근거리이동"].join("-"),
	        customerClass: ["02", "일반고객"].join("-"),
	        sf: ["111", "서울 SF"].join("-"),
	        customerFeature: "고객 주소의 주석",
	        loginName: ["0", ""].join("-")
	    },
	    carInfos: [
	        {
	            carType: "SQ250",
	            carNumber: "000365",
	            // engineNumber,
	            guaranteeBegin: "2021.06.04",
	            guaranteeEnd: "2023.06.03",
	            agencyCode: "80000008",
	            agencyName: "강병용",
	            // vendorName,
	            
	        },
	    ],
	    serviceRecords: [
	        {
	            notificationNumber: "30045000",
	            receiptDate: "2021.06.09",
	            receiptTime: "00:00:00",
	            faultyPart: "아이들 스피드 액튜...",
	            activity: "엔진부품수리",
	           // sfName,
	           // coverStore,
	            mileage: 5000,
	            purchaseDate: "2021.06.04",
	            orderNumber: "63000000",
	            treatTime:"2021.06.10",
	            treatDate: "09:00:00",
	            causeSymptom: "도금(도장) 불량",
	            duty: "수리",
	            carType: "SQ250",
	            treatment1: "조치내용",
	            treatment2: "조치결과",
	            paid: true
	        }
	    ]
	}
}
