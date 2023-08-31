module.exports = async (draft, { file, request }) => {
  const { uuid } = request.body;
  try {
    const path = `/query_data/${uuid}.json`; // file path 입력
    const fileData = await file.get(path, { gziped: true });
    draft.response.statusCode = 200;
    draft.response.body = { ...JSON.parse(fileData), uuid: uuid };
  } catch (err) {
    draft.response.statusCode = 200;
    draft.response.body = { queryData: {}, uuid: uuid };
  }
};
