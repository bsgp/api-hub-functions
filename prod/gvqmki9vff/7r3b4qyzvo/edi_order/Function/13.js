module.exports = async (draft, { file }) => {
  draft.response.body = [];
  const targetCustomer = [
    "5013546119636", //savers
    "5015715444440", //asda
    "5016033000008", //superdrug
    "5000119000006", //TESCO
    "5000169000001", //Waitrose
    "5000167000003", //boots
    "5010011900016", // sainsbury
    "5013546229793", // MORRISONS
    "5010645000008", // Alliance Healthcare
  ];
  const isTest = true;

  draft.pipe.json.targetCustomer = targetCustomer;
  draft.pipe.json.isTest = isTest;
  draft.pipe.json.SalesOrderArr = [];
  draft.pipe.json.CustomerName = [];
  draft.pipe.json.ShiptoName = [];
  draft.pipe.json.isComplete = [];
  draft.pipe.json.EAN = [];
  draft.pipe.json.ProductIDs = [];

  // sftp에서 가져온 xml 파일이 있는지 체크(array)
  // const fullPathList = await file.list("/custom/FROM_OpenText/");
  console.log(file);
  const fullPathList = [
    "custom/FROM_OpenText_test/ord_5010645000008_20211215190828.xml",
  ];
  // const fullPathList = isTest
  //   ? [
  //       // "custom/FROM_OpenText/ord_5013546119636_20210531011143.xml",
  //  "custom/FROM_OpenText_test/" + "ord_5000119000006_20210723024512.xml",
  //     ]
  //   : await file.list("/custom/FROM_OpenText/");

  draft.pipe.json.fullPathList = fullPathList;

  if (!fullPathList) {
    draft.response.body.push("no files in '/custom/FROM_OpenText/'");
  } else {
    draft.response.body.push(fullPathList);
  }
};
