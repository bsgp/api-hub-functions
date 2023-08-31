module.exports = async (draft, { request, file }) => {
  let response_body = {};

  if (!checkAdmin(request.headers["bsg-support-user-id"])) {
    response_body.E_STATUS = "F";
    response_body.E_MESSAGE = "Not authorized user...";

    draft.response.body = response_body;
    return;
  }

  switch (request.method) {
    case "GET": {
      if (request.body.path === undefined || request.body.path === null) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Path is missing...";
        break;
      }

      if (request.body.mode === "list") {
        response_body = await file.list(`/apitest/${request.body.path}`);
      } else if (request.body.mode === "get") {
        response_body = await file.get(`/apitest/${request.body.path}`, {
          gziped: true,
          toJSON: true,
        });
      } else {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Mode is missing...";
      }
      break;
    }
    case "POST": {
      if (
        !request.body.serviceCode ||
        !request.body.testCode ||
        !request.body.content
      ) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Check serviceCode, testCode and content...";
        break;
      }

      await file.upload(
        `/apitest/${request.body.serviceCode}/${request.body.testCode}.json`,
        request.body.content,
        {
          gzip: true,
          contentType: "application/json",
        }
      );

      response_body.E_STATUS = "S";
      response_body.E_MESSAGE = "Upload Complete!";
      break;
    }
    default: {
      response_body.E_STATUS = "F";
      response_body.E_MESSAGE = "Not available request...";
    }
  }

  draft.response.body = response_body;
};

function checkAdmin(currentUser) {
  const administrators = ["jhcho"]; // 임시

  return currentUser && administrators.includes(currentUser);
}
