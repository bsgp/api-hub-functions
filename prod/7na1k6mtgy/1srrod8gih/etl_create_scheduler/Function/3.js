module.exports = async (draft, { request, task }) => {
  // your script
  const { Period, RelativeNumber, RelativeType } = request.body;
  const [periodType, time] = Period;
  if (RelativeType === "Day" && RelativeNumber === 0) {
    draft.response.body.message = "1 이상의 숫자로 설정해주세요.";
    draft.response.statusCode = 500;
    draft.json.terminateFlow = true;
    return;
  }

  draft.response.body = [];
  let schedulerData;

  switch (periodType) {
    case "hourly": {
      schedulerData = await task.addSchedule(
        `${request.body.DataSetName}$hourly`, // Taks 생성하는 함수의 ID
        "etl_parallel_batch", // 불러올 함수의 ID
        request.stage,
        "0 0/1 ? * * *", //every hour
        { ...request.body, requestFrom: "Scheduler" }
      );
      break;
    }
    case "daily": {
      const [hour, min] = time.split(":");
      let newHour = parseInt(hour) - 9;
      const newMin = min === "00" ? "0" : min;
      if (newHour < 0) {
        newHour = 24 + newHour;
      }

      schedulerData = await task.addSchedule(
        `${request.body.DataSetName}$daily$${hour}${min}`,
        "etl_parallel_batch",
        request.stage,
        `${newMin} ${newHour} * * ? *`, //every day
        { ...request.body, requestFrom: "Scheduler" }
      );
      break;
    }

    default: {
      draft.response.body.message =
        "Scheduler Option을 선택 후 다시 시도해주세요.";
      break;
    }
  }
  draft.response.body.push(schedulerData, { ...request.body });
};
