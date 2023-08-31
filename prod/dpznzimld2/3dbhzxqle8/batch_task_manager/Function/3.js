module.exports = async (draft, { request, task }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  switch (request.method) {
    case "GET": {
      // [요청 쿼리]
      // groupId: string
      const { groupId } = request.body;
      if (!groupId) {
        setFailedResponse("Request query 'groupId' is missing");
        return;
      }

      draft.response.body = await task.listSchedules(groupId);
      break;
    }
    case "POST": {
      // [파라미터]
      // mode: "add" | "delete"
      // groupId: string
      // taskId: string           (mode === "add")
      // alias: string            (mode === "add")
      // cron: string             (mode === "add")
      // payload?: string         (mode === "add")

      const { mode, groupId } = request.body;
      if (!mode || !["add", "delete"].includes(mode)) {
        setFailedResponse(
          "Parameter 'mode' should be either 'add' or 'delete'"
        );
        return;
      }
      if (!groupId) {
        setFailedResponse("Parameter 'groupId' is missing");
        return;
      }

      switch (mode) {
        // case "add": {
        //   const { taskId, alias, cron, payload } = request.body;
        //   if (!taskId || !alias || !cron) {
        //     setFailedResponse(
        //       "Either of parameters 'taskId', 'alias' or 'cron' is missing"
        //     );
        //     return;
        //   }

        //   const addedScheduler = await task.addSchedule(
        //     groupId,
        //     taskId,
        //     alias,
        //     cron,
        //     payload
        //   );

        //   draft.response.body = [];
        //   draft.response.body.push(groupId);
        //   draft.response.body.push(addedScheduler);
        //   break;
        // }
        case "delete": {
          draft.response.body = await task.deleteSchedule(groupId);
          break;
        }
      }
      break;
    }
    default: {
      setFailedResponse("Check the request method and try again");
      return;
    }
  }
};
