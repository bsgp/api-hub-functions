module.exports = async (draft, { file, log }) => {
  //comments, commentsHistory, commentsFiles
  // your script
  if (draft.response.body.E_STATUS !== "N") {
    return;
  }
  const tables = {
    comments: {
      name: "COMMENTS",
      desc: "개발 로드맵 수정요청사항",
    },
    commentsHistory: {
      name: "COMMENTS_HISTORY",
      desc: "개발 로드맵 수정요청이력",
    },
    commentsFiles: {
      name: "COMMENTS_FILES",
      desc: "개발 로드맵 수정요청 파일",
    },
  };

  const uploadConfig = await file.upload("config/commentsTables.json", tables, {
    gzip: true,
  });

  log("upload commentsTables config:", uploadConfig);

  draft.pipe.json.tables = JSON.stringify(tables);
  draft.response.body = {};
};
