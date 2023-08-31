module.exports = async (draft, { request, createUser }) => {
  const { Id, Name, RolesKey, Password } = request.body.Data;
  const result = await createUser(Id, {
    name: Name,
    rolesKey: RolesKey,
    password: Password,
    passwordIsReset: true,
  });

  if (result.id === Id) {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `사용자 ${Id} 생성되었습니다`,
    };
    draft.pipe.json.terminateFlow = true;
  } else {
    draft.pipe.json.result = result;
  }
};
