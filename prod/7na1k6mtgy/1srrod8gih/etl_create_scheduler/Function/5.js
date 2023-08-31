module.exports = async (draft, { request, task, lib }) => {
  const { isTruthy, dayjs } = lib;
  // 221015 스케줄 리스트 조회 리스트 기능 작성
  const { datasetId } = request.body;
  const list = await task.listSchedules(`${datasetId}$`);
  const { results } = list;

  if (isTruthy(results)) {
    draft.response.body = {
      results: results.reverse().map((key) => ({
        groupID: key.body.groupID,
        occurrences: key.occurrences.map((time) =>
          dayjs(time).add(9, "hour").format("MM/DD HH:mm")
        ),
        periodDateType: key.body.payload.Period
          ? key.body.payload.Period[0]
          : "",
        periodTime: key.body.payload.Period ? key.body.payload.Period[1] : "",
        conditions: key.body.payload.Options,
      })),
    };
  } else {
    draft.response.body = { results };
  }
};
