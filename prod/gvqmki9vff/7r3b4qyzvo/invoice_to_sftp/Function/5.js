module.exports = async (draft, { soap, file }) => {
  const isTest = true;
  // 송장 처리 고객
  const targetCustomer = [
    "C1002", // ASDA
    "C1003", // SAINSBURY'S
    "C4001", // SAVERS
    "C3002", // SUPERDRUG
    "C3001", // BOOTS
    "C1004", // WAITROSE
    //"C1001", // TESCO
  ];
  const changeGLNCustomer = ["C3001", "C1004"];
  const exceptTxCode = ["C3001", "C4001", "C3002"];

  draft.response.body = [];

  draft.pipe.json.targetCustomer = targetCustomer;
  draft.pipe.json.changeGLNCustomer = changeGLNCustomer;
  draft.pipe.json.exceptTxCode = exceptTxCode;
  draft.pipe.json.isTest = isTest;

  let wsdlAlias = "";
  let certAlias = "";

  if (isTest) {
    wsdlAlias = "test9";
    certAlias = "test6";
  } else {
    wsdlAlias = "prod5";
    certAlias = "prod1";
  }

  // wsdl = 'queryinvoice';

  let fromtime;

  let toTime = new Date().getTime();
  // toTime += (1 * 60 * 60 * 1000); //영국은 utc + 1 ?
  toTime = new Date(toTime).toISOString();

  await file
    .get("/send/opentext/lghhuk/regtime.txt", { gziped: true })
    .then((txt) => {
      fromtime = txt;
      //마지막 조회 후 1밀리세컨드 이후 건 조회
      fromtime = new Date(fromtime).getTime();
      fromtime += 1;
      return (fromtime = new Date(fromtime).toISOString());
    })
    .catch(() => {
      //저장된 스케줄러 실행 시간 없으면 30분 전
      let today = new Date().getTime();
      today -= 30 * 60 * 1000;
      // today += (9 * 60 * 60 * 1000);
      fromtime = new Date(today).toISOString();
    });

  if (isTest) {
    fromtime = "2021-07-30T00:27:30Z";
    toTime = "2021-07-30T01:27:34Z";
  }

  const result = await soap(`queryinvoice:${wsdlAlias}`, {
    p12ID: `lghhuktest:${certAlias}`,
    operation: "FindByElements",
    payload: {
      CustomerInvoiceSelectionByElements: {
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
      },
    },
  });

  if (result.statusCode === 200) {
    draft.pipe.json.toTime = toTime;
    draft.pipe.json.fromtime = fromtime;
    draft.pipe.json.Invoices = result;
    // draft.response.body.push(JSON.parse(result.body));
  }
};
