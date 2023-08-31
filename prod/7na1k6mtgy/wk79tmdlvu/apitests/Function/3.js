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
      response_body.data = await getTests(
        file,
        request.body.service,
        request.body.search
      );
      response_body.E_MESSAGE = "Received GET";
      break;
    }
    case "POST": {
      response_body.E_MESSAGE = "Received POST";
      break;
    }
    case "PATCH": {
      const mode = request.body.mode;
      if (!mode || !["modify", "hide"].includes(mode)) {
        response_body.E_STATUS = "F";
        response_body.E_MESSAGE = "Parameter 'mode' is missing...";
        break;
      }
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

async function getTests(file, serviceCode, searchQuery) {
  const services = await file.get("/apitest/services.json", {
    gziped: true,
    toJSON: true,
  });
  const tests = services.filter((item) => item.serviceCode === serviceCode)[0]
    .tests;

  return tests
    .filter((item) => item._isVisible)
    .filter((item) =>
      searchQuery
        ? item.testCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.testDesc.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .map((item) => {
      return {
        testCode: item.testCode,
        testName: item.testName,
        testDesc: item.testDesc,
      };
    });
}
