module.exports = async (draft, { request, file }) => {
  if (request.method !== "GET") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed: Wrong Request method`,
    };
    return;
  }

  // AWS S3 file list 조회
  const path = "srm/notice";
  const fileList = await file.list(path);
  const find = fileList.find((vFile) => vFile === "srm/notice/notice.json");
  if (find !== undefined) {
    const fileData = await file.get(find, { gziped: true });
    const objFileData = JSON.parse(fileData);
    objFileData.sort((a, b) => {
      return b.num - a.num;
    });
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "Succeed",
      fileList: fileList,
      find,
      result: objFileData,
    };
  } else {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "Succeed",
      fileList,
      find,
      result: [],
    };
  }

  draft.response.statusCode = 200; // Response statuscode setting
};
