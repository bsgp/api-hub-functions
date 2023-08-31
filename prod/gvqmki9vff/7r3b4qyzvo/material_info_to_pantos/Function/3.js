module.exports = async (draft, { soap, file, log }) => {
  draft.response.body = [];

  // 테스트
  const isTest = draft.pipe.json.isTest;

  // 운영
  //   let isTest = false;

  let MaterialwsdlAlias;
  let certAlias;
  let tenantID;

  if (isTest) {
    MaterialwsdlAlias = "test3";
    certAlias = "test4";
    tenantID = "my356725";
  } else {
    MaterialwsdlAlias = "prod2";
    certAlias = "prod2";
    tenantID = "my357084";
  }

  let fromtime;
  let nowtime = new Date().getTime();
  nowtime = new Date(nowtime).toISOString();

  await file
    .get("/send/material/pantos/regtime.txt", { gziped: true })
    .then((txt) => {
      //   draft.response.body.push(txt);
      fromtime = txt;
      // 마지막 조회 후 1밀리세컨드 이후 건 조회
      fromtime = new Date(fromtime).getTime();
      fromtime += 1;
      fromtime = new Date(fromtime).toISOString();
      return;
    })
    .catch((err) => {
      // 저장된 스케줄러 실행 시간 없으면 운영 전환 시간
      fromtime = "2021-06-10T00:01:01.0001Z";
      log(err);
    });

  //   fromtime = "2021-07-11T00:01:01.0001Z";

  /* 테스트할때 강제 변환 용
  if (isTest) {
    fromtime = "2021-06-10T00:01:01.0001Z";
  }
*/
  const result = await soap(`querymaterials:${MaterialwsdlAlias}`, {
    p12ID: `lghhuktest:${certAlias}`,
    tenantID,
    operation: "FindByElements",
    payload: {
      MaterialSelectionByElements: {
        SelectionByLastChangeSinceDateTime: fromtime,
      },
    },
  });

  // 변수 전달
  draft.pipe.json.material = JSON.parse(result.body);
  draft.pipe.json.fromtime = fromtime;
  draft.pipe.json.nowtime = nowtime;
};
