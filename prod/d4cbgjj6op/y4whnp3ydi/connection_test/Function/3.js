module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "연결  테스트  성공",
  };

  //   const result = await file.get("if/list.json", { gziped: true, toJSON: true });
  //   draft.response.body = result;
};
