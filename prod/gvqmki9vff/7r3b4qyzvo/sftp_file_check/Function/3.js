module.exports = async (draft, { file, lib }) => {
  const { tryit } = lib;
  const isTest = false;
  const hostname = isTest
    ? "my356725.sapbydesign.com"
    : "my357084.sapbydesign.com";
  const username = "cfo";
  const password = isTest ? "Lguklghq20221" : "Lguklghq2022";
  const idNpw = `${username}:${password}`;
  const authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  draft.pipe.json.hostname = hostname;
  draft.pipe.json.authorization = authorization;

  draft.response.body = {};

  // sftp에서 가져온 xml 파일이 있는지 체크(array)
  const fullPathList = await file.list("/custom/FROM_OpenText/");
  // const fullPathList = await file.list("/custom/FROM_OpenText_done/");

  draft.pipe.json.fullPathList = fullPathList;
  if (!fullPathList) {
    draft.response.body.message = "no files in '/custom/FROM_OpenText/'";
  } else {
    draft.response.body.fullPathList = fullPathList;
  }

  const dateList = fullPathList.map((item) => {
    const fileName = item.replace(/^custom\/FROM_OpenText\/|\.xml$/g, "");
    // const fileName=item.replace(/^custom\/FROM_OpenText_done\/|\.xml$/g, "");

    const [ord, customer, ds] = fileName.split("_");
    const dFn = function (num) {
      return num === 0 ? ds.substring(0, 4) : ds.substring(num, num + 2);
    };
    const parse = tryit(
      () =>
        `${dFn(0)}-${dFn(4)}-${dFn(6)}` + `T${dFn(8)}:${dFn(10)}:${dFn(12)}`,
      ""
    );
    const newDate = new Date(parse);
    const valueOf = newDate.valueOf();

    const fData = { customer, dateString: ds, parse, valueOf, type: ord };
    fData.fileName = fileName;
    fData.fullPath = item;
    return fData;
  });

  const today = new Date();
  const iso = today.toISOString();
  const current = { parse: today, valueOf: today.valueOf(), iso };
  draft.response.body.current = current;

  draft.pipe.json.dateList = dateList;
  draft.response.body.dateList = dateList;
  draft.response.body.hasIssue = dateList
    .map((dObj) => {
      const distance = current.valueOf - dObj.valueOf;
      if (distance > 60 * 60 * 24 * 1000) {
        return dObj;
      } else return undefined;
    })
    .filter(Boolean);
};
