module.exports = async (draft, { task }) => {
  const taskID = await task.create(
    "send_material_info_task",
    "material_info_to_pantos",
    "prod"
  );
  draft.response.body = taskID;
};
