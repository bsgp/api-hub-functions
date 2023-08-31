module.exports = async (draft, { request, file }) => {
  const response_body = {
    E_STATUS: "S", // [S, F]
    E_MESSAGE: "",
  };

  switch (request.method) {
    case "GET": {
      if (!request.body.service) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Parameter 'service' is missing...";
        break;
      }
      if (!request.body.test) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Parameter 'test' is missing...";
        break;
      }
      const testPageData = await getTestFileData(
        file,
        request.body.service,
        request.body.test
      );
      if (!testPageData) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Failed to load test data ...";
        break;
      }
      response_body.data = testPageData;
      response_body.E_MESSAGE = "Received GET";
      break;
    }
    case "POST": {
      response_body.data = getTestResult(
        request.body.testUser,
        request.body.testData
      );
      response_body.E_MESSAGE = "Received POST";
      break;
    }
    case "PATCH": {
      response_body.E_MESSAGE = "Received PATCH";
      break;
    }
    default: {
      response_body.E_STATUS = "F";
      response_body.E_MESSAGE = "Not available request...";
    }
  }

  draft.response.body = response_body;
};

async function getTestFileData(file, serviceCode, testCode) {
  const data = await file.get(`/apitest/${serviceCode}/${testCode}.json`, {
    gziped: true,
    toJSON: true,
  });
  return data;
}

/*
async function updateTestFileData(file, serviceCode, testCode, data) {
  await file.upload(`/apitest/${serviceCode}/${testCode}.json`, data, {
    gzip: true,
    contentType: "application/json",
  });
}
*/

function getTestResult(testUser, testData) {
  return {
    testUser,
    testData,
    xmlPreview: "<>...</>",
    testResponse: "{...}",
  };
}

/*
function checkAdmin(currentUser) {
  const administrators = ["jhcho"]; // 임시

  return currentUser && administrators.includes(currentUser);
}
*/
