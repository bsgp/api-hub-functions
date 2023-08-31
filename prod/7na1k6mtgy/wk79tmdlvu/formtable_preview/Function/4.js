module.exports = async (draft, context) => {
  const { request, file } = context;
  const id = "230125_0921";
  const path = `formtable/savedFiles/${id}.json`; // file path 입력

  let fileData = "";
  let response_body = "";

  switch (request.method) {
    case "GET": {
      //JSON.parse() get메소드에서 처리
      // fileData = await file.get(path, { gziped: true });
      await file.list(path, { gziped: true });
      response_body = "POST request is Done :)";
      break;
    }
    case "POST": {
      //JSON.stringify는 upload메소드에서 처리
      fileData = request.body.data;
      response_body = await file.upload(path, fileData, { gziped: true });
      break;
    }
    default: {
      response_body = "Default value is returned";
    }
  }

  draft.response.body = response_body;
};
