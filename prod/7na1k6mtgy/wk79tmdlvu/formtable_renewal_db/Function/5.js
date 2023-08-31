module.exports = async (draft, { request }) => {
  console.log(draft, request);
};

// #func#3 : validation, pipe 세팅
// module.exports = async (draft, { request, lib, file }) => {
//   const { tryit } = lib;
//   const { isFalsy } = lib.type;
//   const method = request.method;

//   const getFailedRes = (msg) => {
//     draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
//     draft.response.statusCode = 400;
//   };
//   if (isFalsy(tryit(() => request.body))) {
//     getFailedRes("Body is required");
//     return;
//   }
//   // body: {
//   //   "InterfaceId": "CMS_DATA_REQUEST",
//   //   "Function": {
//   //     "UserId": "bbb",
//   //     "UserText": "tUser",
//   //     "SysId": "SUPPORT",
//   //     "Type": "DB",
//   //     "Name": "CMS DATA request"
//   //   },
//   //   "Data": {
//   //     "create": [{}],
//   //     "update": [{}],
//   //     "delete": [{}]
//   //   },
//   //   "DB": "system"
//   // }

//   const body = tryit(() => request.body, {});
//   let validation = true;
//   if (typeof body !== "object") {
//     validation = false;
//     return getFailedRes("Typeof Body is wrong");
//   }
//   if (body.InterfaceId !== "CMS_DATA_REQUEST") {
//     validation = false;
//     return getFailedRes("Wrong InterfaceId");
//   }
//   const functionKey = ["UserId", "UserText", "SysId", "Type", "Name"];
//   if (functionKey.find((key) => !Object.keys(body.Function).includes(key))) {
//     validation = false;
//     return getFailedRes("Wrong Function key");
//   }
//   const dbName = body.DB;
//   const dbList = ["system", "tax", "ledger", "costCenter"];
//   if (!dbList.includes(dbName)) {
//     validation = false;
//     return getFailedRes("Wrong DB");
//   }
//   const dbMethod = ["create", "update", "delete"];
//   const data = body.Data;
//   if (!data || Object.keys(data).find((key) => !dbMethod.includes(key))) {
//     validation = false;
//     return getFailedRes("Wrong Data");
//   }

//   const result = await file.get("config/tables.json", {
//     gziped: true,
//     toJSON: true,
//   });

//   draft.pipe.json.validation = validation;
//   draft.pipe.json.reqBody = body;
//   draft.pipe.json.Data = data;
//   draft.pipe.json.httpMethod = method;
//   draft.pipe.json.table = result[body.DB].name;
//   draft.response.body = {
//     validation,
//     method,
//     table: result[body.DB].name,
//     data,
//     user: body.Function.UserId,
//   };
// };
////////////////////////////////////////////////////////////////////////
// func#4 post 연습
// module.exports = async (draft, { util, sql }) => {
//   const { validation, table, reqBody, Data } = draft.pipe.json;

//   if (!validation || !Data.create) {
//     return;
//   }
//   const data = Data.create.map((item) => util.upKeys(item));

//   if (reqBody.DB === "system") {
//     const querySys = sql().select(table);
//     const resultSys = await querySys.run();
//     if (resultSys.body.list.length > 1) {
//       draft.response.statusCode = 400;
//       draft.response.body = { E_MESSAGE: `Failed save ${table}, use patch` };
//       return;
//     }
//   }
//   const user = reqBody.Function.UserId;

//   // insert Log
//   const dataObj = data.map((item) => {
//     let obj = {
//       SYSTEM_ID: item.SYSTEM_ID,
//       COMPANY_ID: item.COMPANY_ID,
//       CREATED_BY: user,
//       UPDATED_BY: user,
//     };
//     if (reqBody.DB === "system") {
//       obj.IMPORT = item.IMPORT;
//       obj.EXPORT = item.EXPORT;
//     } else {
//       obj = {
//         ...obj,
//         ID: item.ID,
//         TEXT: item.TEXT,
//         IS_ACTIVATED: true,
//         COUNTRY_CODE: item.COUNTRY_CODE,
//       };
//     }
//     return obj;
//   });

//   const builder = sql("mysql");

//   // dataObj 안에 중복값 체크 필요

//   let isValid = true;
//   const validResult = [];
//   const validator = await builder.validator(table);
//   data.every((item) => {
//     const result = validator(item);
//     if (!result.isValid) {
//       isValid = result.isValid;
//       validResult.push(result.errorMessage);
//     }
//     return result.isValid;
//   });

//   if (!isValid) {
//     draft.response.statusCode = 400;
//     draft.response.body.validResult = validResult;
//     return;
//   }

//   const query = dataObj.reduce((acc, obj) =>
//acc.insert(table, obj), builder);

//   const result = await query.run();

//   if (result.statusCode === 200) {
//     draft.response.body.E_STATUS = "S";
//     draft.response.body.E_MESSAGE = `saved successfully`;
//   } else {
//     draft.response.body = {
//       E_STATUS: "F",
//       E_MESSAGE: `Failed save ${table}`,
//       result,
//     };
//     draft.response.statusCode = 400;
//     return;
//   }
// };
