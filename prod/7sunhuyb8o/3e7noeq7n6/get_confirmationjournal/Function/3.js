module.exports = async (draft, context) => {
  const { request, odata, fn, env, dayjs, file } = context;
  let params = request.body || {};
  draft.response.body = {};
  if (Object.keys(params).length === 0) {
    try {
      params = await file
        .get("byd/data/get_confirmationjournal/query_date")
        .then((res) => JSON.parse(res));
      draft.response.body = {
        ...draft.response.body,
        nextD: fn.addWeekdays(dayjs, params.creationDate, -1),
        creationDate: params.creationDate,
      };
      await file.upload("byd/data/get_confirmationjournal/query_date", {
        creationDate: fn.addWeekdays(dayjs, params.creationDate, -1),
        includeCanceledItem: true,
      });
    } catch (error) {
      const today = context.kst.format("YYYY-MM-DD");
      params = {
        creationDate: fn.addWeekdays(dayjs, today, -1),
        includeCanceledItem: true,
      };
      await file.upload("byd/data/get_confirmationjournal/query_date", params);
    }
  } else {
    draft.json.notSaveFile = true;
  }
  draft.response.body.req_params = params;
  draft.json.params = params;
  const resultUploadKey = request.body && request.body.resultUploadKey;
  const username = env.BYD_ID;
  const password = env.BYD_PASSWORD;

  /** 확인분개 조회  */
  const queryString = fn.getQueryParams({ params, env });
  const url = [
    `${env.BYD_URL}/sap/byd/odata/cc_home_analytics.svc/`,
    "RPSCMCFJU01_Q0001QueryResults?",
    Object.keys(queryString)
      .map((key) => `${key}=${queryString[key]}`)
      .join("&"),
  ].join("");
  const cfjData = await fn.fetchAll(odata, { url, username, password });
  // const cfjData = await odata.get({ url, username, password });
  // draft.response.body.cfjData = cfjData;
  if (cfjData.errorMsg && !draft.json.notSaveFile) {
    await file.upload(
      `byd/data/get_confirmationjournal/error/${params.creationDate}`,
      { creationDate: params.creationDate, errorMsg: cfjData.errorMsg }
    );
  }
  const result = cfjData.result;
  const confirmationJournal = result.map((item) => {
    const newItem = {
      ...item,
      CBT_POSTING_DATE: fn.convDate(dayjs, item.CBT_POSTING_DATE),
      CTA_DATE: fn.convDate(dayjs, item.CTA_DATE),
      CCH_DATE: fn.convDate(dayjs, item.CCH_DATE),
    };
    if (item[env.CGMP_PROD_DATE]) {
      newItem[env.CGMP_PROD_DATE] = fn.convDate(
        dayjs,
        item[env.CGMP_PROD_DATE]
      );
    }
    return newItem;
  });
  draft.json.confirmationJournal = confirmationJournal;

  draft.response.body = {
    ...draft.response.body,
    confirmationJournal,
    count: confirmationJournal.length,
    url,
  };

  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: "조회 완료",
      params,
      url,
      confirmationJournal,
    });
  }
};
