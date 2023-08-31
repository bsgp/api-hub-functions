module.exports = async (draft, { updateUser }) => {
  // const initialPassword = "initial123";

  // // 사용자 생성
  // const result = await createUser("abcde", {
  //   name: "ff name",
  //   password: initialPassword,
  //   passwordIsReset: true,
  //   rolesKey: "부품점",
  // });

  // // 사용자 변경
  // const result = await updateUser("abcde", {
  //   name: "ffs name",
  //   rolesKey: "위탁점",
  // });

  // // 사용자 비밀번호 초기화
  // const result = await updateUser("abcde", {
  //   password: initialPassword,
  //   passwordIsReset: true,
  // });

  // 사용자 차단
  const result = await updateUser("abcde", {
    blocked: true,
  });

  draft.response.body = result;
};
