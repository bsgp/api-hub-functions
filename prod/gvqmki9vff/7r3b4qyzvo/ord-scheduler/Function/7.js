module.exports = async (draft, { task }) => {
  // 1시간 마다 호출
  const result = await task.addSchedule(
    "get_debit_note_prod",
    "edi_debit_note_upload",
    "prod",
    "0 0/1 * * ? *"
  ); //Debit Note 스케줄
  draft.response.body = {
    message: "DebitNote Schedule",
    result,
  };
};
