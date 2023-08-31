module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "E",
    E_MESSAGE: "대상 시스템별로 오류 메시지의 데이터 구조가 다를수 있습니다",
  };
  draft.response.statusCode = 500;
};
