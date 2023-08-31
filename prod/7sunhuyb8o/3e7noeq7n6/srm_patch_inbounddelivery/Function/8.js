module.exports = async (draft, { env, fn, odata, dayjs, kst }) => {
  try {
    const { type, form } = draft.json.params;
    switch (type) {
      case "UPDATE_IDN": {
        /**
         * 출고일은 api로 수정 불가. 기존 입하통지 취소처리하고 새로운 입하통지를 생성
         * 출고일이 변경되었는지 확인을 위해서 납품통지 내역 조회
         */
        const { BYD_URL, BYD_ID, BYD_PASSWORD } = env;
        const idnID = form.idnID;
        const deliveryDate = form.deliveryDate;
        const queryStringObj = {
          "sap-language": "ko",
          $inlinecount: "allpages",
          $format: "json",
          $expand: [
            "InboundDeliveryArrivalPeriod",
            "InboundDeliveryItem/InboundDeliveryDeliveryQuantity",
          ].join(","),
          $filter: `ID eq '${idnID}'`,
        };
        const queryString = Object.keys(queryStringObj)
          .map((key) => `${key}=${queryStringObj[key]}`)
          .join("&");

        const service = [
          "/sap/byd/odata/cust/v1",
          "bsg_inbounddeliveryrequest/InboundDeliveryCollection?",
        ].join("/");
        const url = [BYD_URL, service, queryString].join("");
        draft.response.body.url = url;

        const queryIDN = await fn
          .fetchAll(odata, { url, username: BYD_ID, password: BYD_PASSWORD })
          .then((res) => {
            return res.result || [];
          });

        const fIDN = queryIDN[0] || {};
        draft.response.body.originIDN = fIDN;
        draft.response.body.originIDN_ObjectID = fIDN.ObjectID;
        draft.json.originIDN_ObjectID = fIDN.ObjectID;

        const releaseStatusCode = fIDN.ReleaseStatusCode;
        const arrivalPeriod = fIDN.InboundDeliveryArrivalPeriod || {};
        const arrivalStartDate = arrivalPeriod.StartDateTime;
        if (releaseStatusCode !== "1") {
          /** 릴리스 되지 않은 경우에만 납품통지 변경 가능, 1: 릴리스 안됨 */
          draft.json.nextNodeKey = "Function#5";
          draft.response.body = {
            ...draft.response.body,
            releaseStatusCode,
            E_STATUS: "F",
            E_MESSAGE: "릴리스되지 않은\n입하통지만 수정이\n가능합니다",
          };
        } else {
          draft.json.originIDN = fIDN;
          const today = fn.convDate(dayjs, kst);
          draft.json.today = today;
          const originDeliveryDate = fn.convDate(dayjs, arrivalStartDate);
          if (originDeliveryDate === deliveryDate) {
            draft.json.nextNodeKey = "Function#7";
            draft.response.body = {
              ...draft.response.body,
              deliveryDate,
              originDeliveryDate,
              E_STATUS: "S",
              E_MESSAGE: "입하통지 패치",
            };
          } else if (today > deliveryDate) {
            draft.json.nextNodeKey = "Function#5";
            draft.response.body = {
              ...draft.response.body,
              deliveryDate,
              originDeliveryDate,
              today,
              E_STATUS: "F",
              E_MESSAGE: "출고일은 현재 날짜보다\n과거일 수 없습니다",
            };
          } else {
            draft.json.nextNodeKey = "Function#6";
            draft.response.body = {
              ...draft.response.body,
              deliveryDate,
              originDeliveryDate,
              E_STATUS: "S",
              E_MESSAGE: "입하통지 삭제 후 신규생성",
            };
          }
        }
        break;
      }
      case "DELIVERY_CLOSE": {
        draft.json.nextNodeKey = "Function#4";
        break;
      }
      default: {
        draft.json.nextNodeKey = "Function#5";
        draft.response.body = {
          ...draft.response.body,
          E_STATUS: "F",
          E_MESSAGE: "납품통지 업데이트 타입이 올바르지 않습니다",
        };
        break;
      }
    }
  } catch (error) {
    draft.json.nextNodeKey = "Function#5";
    draft.response.body = {
      errorMessage: error.message,
      E_STATUS: "F",
      E_MESSAGE: "납품통지 업데이트에 실패했습니다",
    };
  }
};
