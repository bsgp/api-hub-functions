module.exports = async (draft, { request, updateUser }) => {
  const { Id, Name, RolesKey, Block } = request.body.Data;
  const blocked = Block === "X";
  const result = await updateUser(Id, {
    name: Name,
    rolesKey: RolesKey,
    blocked,
  });

  if (result.id === Id) {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `사용자 ${Id} 변경되었습니다`,
    };
    draft.pipe.json.terminateFlow = true;
  } else {
    draft.pipe.json.result = result;
  }
};
