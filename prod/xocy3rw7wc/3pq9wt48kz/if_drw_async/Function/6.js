module.exports = async (draft, { file, dayjs, request }) => {
  const cacheKey = ["if_cache", request.body.InterfaceId]
    .join("/")
    .concat(".json");
  const cacheData = await file.get(cacheKey, {
    toJSON: true,
    doNotThrow: true,
    gziped: true,
  });
  if (!cacheData) {
    return;
  }

  const reqTime = dayjs(cacheData.RequestTime);
  const now = dayjs();

  if (cacheData.Status === "Finished") {
    if (reqTime.add(5, "minutes").isAfter(now)) {
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: [
          "접수한 요청이 완료되었습니다, 마지막 요청시간 기준",
          reqTime.from(now, true),
          "뒤에 다시 실행할수 있습니다",
        ].join(" "),
      };
      draft.json.terminateFlow = true;
      return;
    }
  }

  if (cacheData.Status === "Started") {
    if (reqTime.add(5, "minutes").isBefore(dayjs())) {
      return;
    }

    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: ["접수한 요청이 진행중입니다", reqTime.fromNow()].join(", "),
    };
    draft.json.terminateFlow = true;
    return;
  }
};
