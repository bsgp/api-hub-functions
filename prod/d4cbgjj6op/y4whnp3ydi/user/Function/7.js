module.exports = async (draft, { request, updateUser }) => {
  const { Id, Password } = request.body.Data;
  const result = await updateUser(Id, {
    password: Password,
    passwordIsReset: true,
  });

  if (result.password === Password) {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `사용자 ${Id} 비밀번호가 초기화되었습니다`,
    };
    draft.pipe.json.terminateFlow = true;
  } else {
    draft.pipe.json.result = result;
  }
};
