module.exports = async (draft, { request, updateUser }) => {
  const { Id, Block } = request.body.Data;
  const blocked = Block === "X";
  const result = await updateUser(Id, {
    blocked,
  });

  if (result.blocked === blocked) {
    if (blocked) {
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: `사용자 ${Id} 차단되었습니다`,
      };
    } else {
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: `사용자 ${Id} 차단 해제되었습니다`,
      };
    }
    draft.pipe.json.terminateFlow = true;
  } else {
    draft.pipe.json.result = result;
  }
};
