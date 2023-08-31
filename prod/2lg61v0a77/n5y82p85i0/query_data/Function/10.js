module.exports = async (draft, { file, request }) => {
  const { uuid } = request.body;
  try {
    const path = `/query_data/${uuid}.json`; // file path 입력
    const fileData = await file.get(path, { gziped: true });

    draft.response.body = {
      ...JSON.parse(fileData),
      uuid: uuid,
      finished: true,
    };
  } catch (err) {
    draft.response.body = {
      message:
        "검색결과가 아직 없습니다. 다시 한번 시도하거나 관리자에게 문의하세요.",
      uuid: uuid,
      finished: false,
    };
  }
};
