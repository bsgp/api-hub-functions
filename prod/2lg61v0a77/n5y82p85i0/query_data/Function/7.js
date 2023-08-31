const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (char) {
      const rd = (Math.random() * 16) | 0,
        uuid = char === "x" ? rd : (rd & 0x3) | 0x8;
      return uuid.toString(16);
    }
  );
};
// 미리보기 요청 시
module.exports = async (draft, { request }) => {
  const uuid = uuidv4();
  draft.pipe.json.newRequest = { ...request.body, uuid: uuid };
  draft.response.body = { uuid: uuid };
};
