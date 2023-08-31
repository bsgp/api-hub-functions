module.exports = async (draft, { request, fn }) => {
  // your script
  if (request.method === "GET") {
    draft.response.body = "나는 겟 입니다.";
  }
  if (request.method === "POST") {
    draft.response.body = "나는 포스트 입니다.";
  }

  draft.response.body = fn.plus(2, 4);
};
