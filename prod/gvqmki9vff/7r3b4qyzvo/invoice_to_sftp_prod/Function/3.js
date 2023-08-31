module.exports = async (draft, { lib, request, soap, file }) => {
  const { tryit } = lib;
  const isTest = request.stage !== "prod";
  // 송장 처리 고객
  const targetCustomer = [
    "C1002", // ASDA
    "C1003", // SAINSBURY'S
    "C4001", // SAVERS
    "C3002", // SUPERDRUG
    "C3001", // BOOTS
    "C1004", // WAITROSE
    "C1005", // MORRISON
    // "C1001", // TESCO
  ];
  const changeGLNCustomer = ["C3001", "C1004"];
  const exceptTxCode = ["C3001", "C4001", "C3002"];
  const morrisonTxCode = ["C1005"];

  draft.response.body = {};

  draft.pipe.json.targetCustomer = targetCustomer;
  draft.pipe.json.changeGLNCustomer = changeGLNCustomer;
  draft.pipe.json.exceptTxCode = exceptTxCode;
  draft.pipe.json.morrisonTxCode = morrisonTxCode;
  draft.pipe.json.isTest = isTest;

  let wsdlAlias = "";
  let certAlias = "";
  let tenantID = "";

  if (isTest) {
    wsdlAlias = "test13";
    certAlias = "test10";
    tenantID = "my356725";
  } else {
    wsdlAlias = "prod10";
    certAlias = "prod2";
    tenantID = "my357084";
  }

  // wsdl = 'queryinvoice';

  let fromtime;

  let toTime = new Date().getTime();
  toTime = new Date(toTime).toISOString();

  await file
    .get("/send/opentext/lghhuk/regtime.txt", { gziped: true })
    .then((txt) => {
      fromtime = txt;
      // 마지막 조회 후 1밀리세컨드 이후 건 조회
      fromtime = new Date(fromtime).getTime();
      fromtime += 1;
      return (fromtime = new Date(fromtime).toISOString());
    })
    .catch(() => {
      // 저장된 스케줄러 실행 시간 없으면 30분 전
      let today = new Date().getTime();
      today -= 30 * 60 * 1000;
      // today += (9 * 60 * 60 * 1000);
      fromtime = new Date(today).toISOString();
    });

  if (isTest) {
    fromtime = "2022-04-27T00:00:00Z";
    toTime = "2022-05-01T08:00:32.795Z";
  }
  let ciID;
  // 고객기반
  try {
    if (request.method === "POST") {
      const body = tryit(() => request.body, {});
      ciID = body.ciID;
    }

    let selection = {
      SelectionByBuyerPartyID: targetCustomer.map((customerID) => ({
        InclusionExclusionCode: "I",
        IntervalBoundaryTypeCode: "1",
        LowerBoundaryIdentifier: customerID,
      })),
    };
    if (ciID) {
      selection = {
        ...selection,
        SelectionByID: {
          InclusionExclusionCode: "I",
          IntervalBoundaryTypeCode: "1",
          LowerBoundaryIdentifier: ciID || "827",
        },
        SelectionByProcessingTypeCode: [
          {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryCustomerInvoiceProcessingTypeCode: "CI",
          },
        ],
      };
    } else {
      selection = {
        ...selection,
        SelectionByLastChangeDateTime: [
          {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "3",
            LowerBoundaryCustomerInvoiceLastChangeDateTime: fromtime,
            UpperBoundaryCustomerInvoiceLastChangeDateTime: toTime,
          },
        ],
        SelectionByReleaseStatusCode: [
          {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryCustomerInvoiceReleaseStatusCode: "3",
          },
        ],
        SelectionByProcessingTypeCode: [
          {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryCustomerInvoiceProcessingTypeCode: "CI",
          },
        ],
      };
    }

    const result = await soap(`queryinvoice:${wsdlAlias}`, {
      p12ID: `lghhuktest:${certAlias}`,
      tenantID,
      operation: "FindByElements",
      payload: { CustomerInvoiceSelectionByElements: selection },
    });
    draft.response.body = { ciID, result: JSON.parse(result.body) };

    if (result.statusCode === 200) {
      draft.pipe.json.toTime = toTime;
      draft.pipe.json.fromtime = fromtime;
      draft.pipe.json.Invoices = JSON.parse(result.body);
    }
  } catch (error) {
    draft.response.body = {
      ciID,
      message: error.message,
    };
  }
};
