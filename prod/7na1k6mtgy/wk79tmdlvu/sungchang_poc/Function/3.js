module.exports = async (draft, { request }) => {
  // console.log(request);
  // const direction = "Function#6";
  // const { method } = request;

  draft.json.tbOpr = "opr_01";
  draft.json.tbDef = "def_01";
  draft.json.tbMap = "map_03";
  draft.json.tbData = "data_07";

  switch (request.body.TestTask) {
    case "CreateTable":
      draft.json.nextNodeKey = "Function#4";
      break;
    case "CheckTable":
      draft.json.nextNodeKey = "Function#5";
      break;
    case "InitData":
      draft.json.nextNodeKey = "Function#6";
      break;
    default:
      draft.json.nextNodeKey = "Function#8";
      break;
  }
  // if (request && method) {
  //   draft.json.nextNodeKey = "Function#8";
  // } else if (direction === "Function#4") {
  //   = direction;
  // } else if (direction === "Function#5") {
  //   draft.json.nextNodeKey = direction;
  // } else if (direction === "Function#6") {
  //   draft.json.nextNodeKey = direction;
  // } else if (direction === "Function#7") {
  //   draft.json.nextNodeKey = direction;
  // }
};

// module.exports = async (draft, { request, sql }) => {

// const { body, method } = request; // post, put 모두 body
// const validator = await sql("mysql").validator("data_table10");
// const resBody = {
//   E_STATUS: "",
//   E_MESSAGE: "",
//   E_DATA: [],
// };

// switch (method) {
//   case "POST": {
//     const postData = body;

//     postData.every((item) => {
//       const result = validator(item);
//       resBody.E_MESSAGE = result.E_MESSAGE;
//       return result.isValid;
//     });

//     break;
//   }
//   case "PUT": {
//     const putData = body.data;

//     const result = putData.map((item) => {
//       const validation = validator(item);
//       return validation;
//     });

//     resBody.E_DATA = result;
//     break;
//   }
//   default: {
//     console.log("default");
//   }
// }

// draft.response.body = resBody;
// };
