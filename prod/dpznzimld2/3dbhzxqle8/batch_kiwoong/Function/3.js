module.exports = async (draft, { task }) => {
  draft.response.body = [];
  draft.response.body.push("batch_kiwoong_prod");

  const addedScheduler = await task.addSchedule(
    "batch_kiwoong_prod",
    "if_kiwoong",
    "batch",
    "0 * * * * *"
  );
  draft.response.body.push(addedScheduler);
};
