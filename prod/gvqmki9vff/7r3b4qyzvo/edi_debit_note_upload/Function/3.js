module.exports = async (draft, { request, env, file }) => {
  const isTest = request.stage === "dev";

  const hostname = isTest ? env.BYD_URL_TEST : env.BYD_URL;
  const username = env.BYD_ID;
  const password = isTest ? env.BYD_PASSWORD_TEST : env.BYD_PASSWORD;
  const idNpw = `${username}:${password}`;
  const authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  draft.pipe.json.hostname = hostname;
  draft.pipe.json.authorization = authorization;
  draft.pipe.json.isTest = isTest;

  draft.response.body = { hostname, idNpw, isTest };

  // sftp에서 가져온 xml 파일이 있는지 체크(array)
  const fullPathList = await file.list("/custom/Gen_FROM_OpenText/");

  draft.pipe.json.fullPathList = fullPathList;
  draft.response.body.fullPathList = fullPathList;

  if (!fullPathList) {
    draft.response.body.message = "no files in '/custom/Gen_FROM_OpenText/'";
  }
};
