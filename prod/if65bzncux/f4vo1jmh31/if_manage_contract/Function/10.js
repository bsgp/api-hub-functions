module.exports = async (draft, { request }) => {
  // const { tables, newData } = draft.json;
  draft.response.body = {
    request,
    E_STATUS: "S",
    E_MESSAGE: "계약당사자 정보가 조회되었습니다",
  };
};
