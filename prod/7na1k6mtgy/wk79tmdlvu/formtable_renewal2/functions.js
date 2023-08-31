// module.exports = async (draft, { request, sql }) => {
//   const resBody = {
//     E_STATE: "S",
//     E_MSG: "TEST SUCCESS",
//     E_reqBODY: request.body,
//   };

//   // const { tbName, tbData } = request.body.testBody;
//   // const table = sql().select(tbName);
//   // const tableData = await table.run();

//   // const validator = await sql("mysql").validator(tbName);
//   // resBody.E_reqBODY = validator;

//   const { tbData } = request.body.testBody;
//   const dataObject = [tbData];
//   const builder = sql("mysql");

//   const query = dataObject.reduce(
//     (acc, obj) => acc.insert("ftdb_test", obj),
//     builder
//   );
//   const result = await query.run();
//   resBody.E_reqBODY = result;

//   draft.response.body = resBody;
// };

// module.exports = async (draft, { request, sql }) => {
//   const { tableName, id, data } = request.body;
//   const table = sql().select();
//   const tableData = await table.run();

//   const resBody = {
//     E_STATE: "",
//     E_MSG: "",
//     E_reqBODY: [],
//   };
// };

module.exports = async (draft, { request, sql }) => {
  // const { tableName, data } = request.body;
  const { tableName } = request.body;

  let resBody = {
    E_STATUS: "",
    E_MSG: "",
    E_BODY: [],
  };
  // const validator = await sql("mysql").validator(tableName);
  const accValuees = [];
  const fakeData = [
    {
      USER_KEY: "TBC-3217",
      DEFEC_DETAILS: "오염",
      GS3_A: "0",
      GS3_B: "3",
      GS4_A: "1",
      GS4_B: "1",
      TOTAL: "5",
    },
  ];
  const builder = sql("mysql");
  const query = fakeData.reduce((acc, obj) => {
    accValuees.push({ acc, obj });
    return acc.insert(tableName, obj);
  }, builder);

  const result = await query.run();

  if (result) {
    resBody = {
      E_STATUS: "S",
      E_MSG: "SUCCESS",
      E_BODY: result,
      ERR: accValuees,
    };
  } else {
    resBody = {
      E_STATUS: "F",
      E_MSG: "FAILED",
      E_BODY: [],
      ERR: accValuees,
    };
  }

  draft.response.body = resBody;
};
