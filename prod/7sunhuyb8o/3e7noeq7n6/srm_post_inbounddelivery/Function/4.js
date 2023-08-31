module.exports = async (draft, context) => {
  try {
    const { form, list } = draft.json.params;
    const { env, fn, kst, dayjs, odata, soap, tryit } = context;
    const baseURL = env.BYD_URL;
    const username = env.BYD_ID;
    const password = env.BYD_PASSWORD;
    const tenantID = env.BYD_TENANT;

    /**
     * 동종재고 유효성 확인
     * 요청 년/월 알파벳 데이터 + ????으로 마지막 동종재고 반환
     */
    const today = fn.convDate(dayjs, kst, "YYYYMMDD");
    const df_idnID = [today, form.supplier].join("-");
    const inboundDeliveryNotificationID = `${df_idnID}**`;
    const queryIDN_Params = {
      "sap-language": "ko",
      $inlinecount: "allpages",
      $format: "json",
      $select: "ID",
      $filter: `ID eq '${inboundDeliveryNotificationID}'`,
    };
    const idnQueryString = Object.keys(queryIDN_Params)
      .map((key) => `${key}=${queryIDN_Params[key]}`)
      .join("&");

    const idnService = [
      "/sap/byd/odata/cust/v1",
      "bsg_inbounddeliveryrequest",
      "InboundDeliveryCollection?",
    ].join("/");
    const createdTodayIDN_url = [baseURL, idnService, idnQueryString].join("");

    const createdTodayIDN = await fn
      .fetchAll(odata, { url: createdTodayIDN_url, username, password })
      .then(({ result = [] }) => result);

    const numPad = (num = 1) => {
      if (num >= 1000) {
        return num;
      } else return `${num}`.padStart(3, "0");
    };

    /** 결과값이 아무것도 없으면 그냥 생성하면됨.
     * 뭐라도 있으면 Sorting 해서 맨 마지막 거의 +1 번호로 설정
     * 입하통지ID 부여 및 입하통지 생성 */

    let newIDN;
    if (createdTodayIDN.length <= 0) {
      newIDN = `${df_idnID}-${numPad(1)}`;
    } else {
      // Get Length and + 1
      newIDN = `${df_idnID}-${numPad(createdTodayIDN.length + 1)}`;
    }
    draft.json.newIDN = newIDN;
    const createIDN_Params = fn.getCreateIDN_Params({ newIDN, form, list });

    const wsdlAlias = "dev";
    const soap_result = await soap(`manage_standard_idn:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "MaintainBundle",
      payload: createIDN_Params,
    });
    if (soap_result.statusCode === 200) {
      const body = JSON.parse(soap_result.body);
      const idnResult =
        body.StandardInboundDeliveryNotificationConfirmationBody || [];
      newIDN = tryit(() => idnResult[0].DeliveryNotificationID._value_1, "");
      const IDN_ObjectID = tryit(
        () => idnResult[0].UUID._value_1.replace(/-/g, "").toUpperCase(),
        ""
      );
      if (newIDN) {
        draft.response.body.E_STATUS = "S";
        draft.json.IDN_ObjectID = IDN_ObjectID;
      } else {
        draft.response.body.E_STATUS = "F";
        draft.response.body.E_MESSAGE = "입하통지 생성 중 에러가 발생했습니다.";
      }
      draft.response.body = {
        ...draft.response.body,
        createdTodayIDN_url,
        createdTodayIDN,
        createIDN_Params,
        idnID: newIDN,
        IDN_ObjectID,
        soap_result,
      };
    } else {
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = "입하통지 생성 중 에러가 발생했습니다.";
      draft.response.body = {
        ...draft.response.body,
        soap_result,
        createIDN_Params,
      };
    }
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error : ${error.message}`,
    };
  }
};
