module.exports = async (draft, { fn, dayjs, kst, env, odata, soap, tryit }) => {
  const { BYD_URL, BYD_ID, BYD_PASSWORD, BYD_TENANT } = env;
  try {
    /** 출고일은 api로 수정 불가. 기존 입하통지 취소처리하고 새로운 입하통지를 생성 */
    const { form, list } = draft.json.params;
    const today = fn.convDate(dayjs, kst, "YYYYMMDD");
    const supplier = form.supplier;
    /**
     * 새로운 입하통지 ID 생성
     * 아이디 중복을 막기 위해 입하통지 아이디 조회 ,
     * 오늘날짜로 먼저 조회하고 생성하려는 일련번호 결정
     */

    const queryPrefix = [today, supplier].join("-");
    const queryStringObj = {
      $inlinecount: "allpages",
      $format: "json",
      $select: "ID",
      $filter: `ID eq '${queryPrefix}-**'`,
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

    const createdIDNs = await fn
      .fetchAll(odata, { url, username: BYD_ID, password: BYD_PASSWORD })
      .then((res) => res.result || []);

    let newIDN_ID;
    if (createdIDNs.length === 0) {
      newIDN_ID = `${queryPrefix}-001`;
    } else {
      const numpad = `${createdIDNs.length + 1}`.padStart(3, 0);
      newIDN_ID = [queryPrefix, numpad].join("-");
    }
    // 새로운 입하통지 생성
    const newIDN_payload = fn.createIDN_payload({ newIDN_ID, form, list });
    const wsdlAlias = "dev";
    const soap_result = await soap(`manage_standard_idn:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID: BYD_TENANT,
      operation: "MaintainBundle",
      payload: newIDN_payload,
    });
    let newIDN;
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
      draft.json.newIDN = newIDN;
      draft.response.body = {
        ...draft.response.body,
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
      };
    }
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      errorMessage: error.message,
      E_STATUS: "F",
      E_MESSAGE: "납품통지 변경 중\n문제가 발생했습니다",
    };
  }
};
