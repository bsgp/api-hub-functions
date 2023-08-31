module.exports = async (draft, { request, lib, file }) => {
  const { tryit } = lib;
  const { isFalsy } = lib.type;

  // 실패 응답 생성 함수
  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = 400;
  };

  // 요청 method 검사
  if (request.method !== "POST") {
    return getFailedRes("Failed: Wrong Request method");
  }

  // request의 body parameter 검사 결과 저장용 변수
  let validation = true;

  // request에 body parameter가 있는지 검사
  if (isFalsy(tryit(() => request.body))) {
    return getFailedRes("Body is required");
  }

  // request의 body parameter 를 받아온다.
  const body = tryit(() => request.body, {});

  // body parameter 필수항목 검사
  const bodyParams = [
    "title",
    "content",
    "date",
    "author",
    "attachmenturl",
    "attachmentfilename",
  ];
  if (bodyParams.find((key) => !Object.keys(body).includes(key))) {
    validation = false;
    return getFailedRes("Wrong request body data");
  }

  // S3의 path경로에 파일 업로드 함수
  async function catchFn(data, path = "/sendError/") {
    const payloadString = JSON.stringify(data);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(path, buf, { gzip: true });
  }

  // 공지사항 저장용 폴더 경로
  const path = "srm/notice";

  // 공지사항이 저장된 json 파일 경로
  const filePath = "srm/notice/notice.json";

  // 공지사항 저장용 폴더에서 전체파일 목록 읽기서 공지사항 json 파일찾기
  const fileList = await file.list(path);
  const find = fileList.find((file) => file === filePath);

  // 공지사항 저장객체
  let objFileData = [];

  // 공지사항 인덱스 번호
  let num = 1;

  // 공지사항 json 파일이 있을 경우 공지사항 인덱스 번호 구하기
  if (find !== undefined) {
    const fileData = await file.get(filePath, { gziped: true });
    objFileData = JSON.parse(fileData);
    if (objFileData.length > 0) {
      objFileData.sort((a, b) => {
        return a.num - b.num;
      });
      num = objFileData[objFileData.length - 1].num + 1;
    }
  }

  // 공지사항 json 파일에 새로운 공지내용 추가
  objFileData.push({
    num,
    title: body.title,
    content: body.content,
    date: body.date,
    author: body.author,
    attachmenturl: body.attachmenturl,
    attachmentfilename: body.attachmentfilename,
  });

  // 공지사항 json 파일 s3에 업로드
  await catchFn(objFileData, filePath);

  // 공지사항 json 파일을 num 기준으로 역순소팅하여 결과 전달
  objFileData.sort((a, b) => {
    return b.num - a.num;
  });

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "Posted",
    body: { ...request.body },
    result: objFileData,
    paramcheck: validation,
    fileList,
    find,
  };

  draft.response.statusCode = 200; // Response statuscode setting
};
