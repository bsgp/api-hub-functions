module.exports = async (draft, { request }) => {
  console.log(draft, request);
};

// func#3 : get메소드면 조회 값을 리턴하고, get이 아니면 에러 처리
// module.exports = async (draft, { request, file }) => {
//   if (request.method !== "GET") {
//     draft.response.body = {
//       E_STATUS: "F",
//       E_MESSAGE: `Failed: Wrong Request method`,
//     };
//     return;
//   }
//   const tables = await file.get("config/tables.json", {
//     gziped: true,
//     toJSON: true,
//   });

//   draft.pipe.json.tables = tables;
//   draft.response.body = {};
// };
//////////////////////////////////////////////////////////////////////
// func#4
// module.exports = async (draft, { request, util, sql }) => {
//   const tables = draft.pipe.json.tables;

//   const params = util.upKeys(request.params);
//   const dbType = params.DB_TYPE;
//   const requestDB = dbType
//     ? [dbType]
//     : ["system", "tax", "ledger", "costCenter"];

//   let result = true;

//   await Promise.all(
//     requestDB.map(async (dbKey) => {
//       const dbName = tables[dbKey].name;
//       const query = sql("mysql").select(dbName);
//       // if (dbName !== "system") {
//       //   query.where("key", "like", true);
//       // }
//       query.orderBy("CREATED_AT", "desc");
//       const queryResult = await query.run();
//       if (queryResult.statusCode === 200) {
//         draft.response.body[dbKey] = {
//           E_STATUS: "S",
//           result: queryResult.body,
//         };
//         return;
//       } else {
//         result = false;
//         draft.response.body[dbKey] = {
//           E_STATUS: "F",
//           E_MESSAGE: `Failed Get data from ${dbKey} DB`,
//           result: queryResult.body,
//         };
//         return;
//       }
//     })
//   ).catch((error) => {
//     draft.response.body = { error };
//     result = false;
//     return;
//   });

//   if (!result) {
//     draft.response.body.E_STATUS = "F";
//     draft.response.body.E_MESSAGE = `Failed Get data from DB`;
//   } else {
//     draft.response.body.E_STATUS = "S";
//     draft.response.body.E_MESSAGE = "Get data from DB successfully";
//   }
// };
