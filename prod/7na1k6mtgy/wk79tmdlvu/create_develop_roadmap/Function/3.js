module.exports = async (draft, { file, log }) => {
  //comments, commentsHistory, commentsFiles
  // your script
  const tables = {
    comments: {
      name: "comments_6",
      desc: "개발 로드맵 수정요청사항",
    },
    commentsHistory: {
      name: "comments_history_4",
      desc: "개발 로드맵 수정요청이력",
    },
    commentsFiles: {
      name: "comments_files_9",
      desc: "개발 로드맵 수정요청 파일",
    },
  };

  const uploadConfig = await file.upload("config/commentsTables.json", tables, {
    gzip: true,
  });

  log("upload commentsTables config:", uploadConfig);

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
