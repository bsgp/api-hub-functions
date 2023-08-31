module.exports = async (draft, context) => {
  const {
    request,
    // fn, dayjs,
    file,
  } = context;
  // let params = request.body || {};
  const resultUploadKey = request.body && request.body.resultUploadKey;
  draft.response.body = {};
  // if (Object.keys(params).length === 0) {
  //   try {
  //     params = await file
  //       .get("byd/data/get_confirmationjournal/query_date")
  //       .then((res) => JSON.parse(res));
  //     draft.response.body = {
  //       ...draft.response.body,
  //       nextD: fn.addWeekdays(dayjs, params.creationDate, -1),
  //       creationDate: params.creationDate,
  //     };
  //     await file.upload("byd/data/get_confirmationjournal/query_date", {
  //       creationDate: fn.addWeekdays(dayjs, params.creationDate, -1),
  //       includeCanceledItem: true,
  //     });
  //   } catch (error) {
  //     const today = context.kst.format("YYYY-MM-DD");
  //     params = {
  //       creationDate: fn.addWeekdays(dayjs, today, -1),
  //       includeCanceledItem: true,
  //     };
  //   await file.upload("byd/data/get_confirmationjournal/query_date", params);
  //   }
  // }
  draft.response.body.request = request;
  await file.upload("test/data.js", {
    request,
    resultUploadKey,
  });
  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: "조회 완료",
      ...draft.response.body,
      // E_MESSAGE: "조회가 완료되었습니다",
    });
  }
};
