module.exports = async (draft, { request }) => {
  let msg;
  if (request.method === "POST") {
    msg = "포스트 입니다.";
  }
  if (request.method === "GET") {
    msg = "겟 메서드 입니다.";
  }
  draft.response.headers["Content-Type"] = "application/json;charset=UTF-8";
  draft.response.body = { msg };
  // your script
};
