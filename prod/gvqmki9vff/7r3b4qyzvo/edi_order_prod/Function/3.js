module.exports = async (draft, { file }) => {
  draft.response.body = [];
  const targetCustomer = [
    "5013546119636", // savers
    "5015715444440", // asda
    "5016033000008", // superdrug
    "5000119000006", // TESCO
    "5000169000001", // Waitrose
    "5000167000003", // boots
    "5010011900016", // sainsbury
    "5013546229809", // MORRISONS
    "5010645000007", // Alliance Healthcare
  ];
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
  draft.pipe.json.targetCustomer = targetCustomer;
  draft.pipe.json.isTest = isTest;
  draft.pipe.json.SalesOrderArr = [];
  draft.pipe.json.CustomerName = [];
  draft.pipe.json.ShiptoName = [];
  draft.pipe.json.isComplete = [];
  draft.pipe.json.EAN = [];
  draft.pipe.json.ProductIDs = [];
  // sftp에서 가져온 xml 파일이 있는지 체크(array)
  const fullPathList = await file.list("/custom/FROM_OpenText/");
  // const fullPathList = await file.list(
  //   [
  //     "/custom/FROM_OpenText_failed",
  //     "2023/08/22/ord_5010011900016_20230821024737.xml",
  //   ].join("/")
  // );
  // const fullPathList = isTest
  //   ? [
  //       [
  //         // "/custom/FROM_OpenText_done",
  //         "/custom/FROM_OpenText_failed",
  //         "2023/07/24",
  //         "ord_5010011900016_20230724030632.xml"
  //       ].join("/")
  //     ]
  //   : await file.list("/custom/FROM_OpenText/");

  draft.pipe.json.fullPathList = fullPathList;

  if (!fullPathList) {
    draft.response.body.push("no files in '/custom/FROM_OpenText/'");
  }
  // else {
  //   draft.response.body.push(fullPathList);
  // }
};
