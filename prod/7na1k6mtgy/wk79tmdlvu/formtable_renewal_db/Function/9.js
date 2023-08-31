// module.exports = async (draft, { request, sql }) => {
//   const { tbData, tbName } = request.body.testBody;
//   const builder = sql("mysql");

//   const query = builder.multi(tbName);
//   const data = [tbData];

//   data.forEach((each) => {
//     const patchItem = {
//       TEST_DEFECT: "칼자욱",
//     };
//     query.add(function () {
//       this.update(patchItem).where("TEST_DEFECT", each.TEST_DEFECT);
//     });
//   });

//   const result = await query.run();

//   const resBody = {
//     E_STATUS: "S",
//     E_MSA: "PATCH IS DONE",
//     E_resBody: result,
//   };

//   draft.response.body = resBody;
// };

module.exports = async (draft, { request, sql }) => {
  console.log(request, sql);
  const { updatedData, tableName } = request.body;

  const resBody = {
    E_STATUS: "",
    E_MSG: "",
    E_BODY: "",
  };

  // const query = sql("mysql").update(tableName, [...updatedData]);
  const query = sql("mysql").multi(tableName);

  updatedData.forEach((cur) => {
    query.add(function () {
      this.update(cur).where("USER_KEY", cur.USER_KEY);
    });
  });

  const result = await query.run();

  resBody.E_BODY = result;
  draft.response.body = resBody;
};
