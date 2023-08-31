module.exports = async (draft, { request, file }) => {
  const response_body = {
    E_STATUS: "S", // [S, F]
    E_MESSAGE: "",
  };

  switch (request.method) {
    case "GET": {
      response_body.data = await getServices(
        file,
        request.headers["bsg-support-user-id"],
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

async function getServices(file, currentUser, searchQuery) {
  const list_service = await file.get("/apitest/services.json", {
    gziped: true,
    toJSON: true,
  });

  return list_service
    .filter(
      (item) => checkAdmin(currentUser) || (item.tests && item.tests.length > 0)
    )
    .filter((item) =>
      searchQuery
        ? item.serviceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .map((item) => {
      return {
        serviceCode: item.serviceCode,
        serviceName: item.serviceName,
        serviceFile: item.serviceFile,
      };
    });
}

function checkAdmin(currentUser) {
  const administrators = ["jhcho"]; // 임시

  return currentUser && administrators.includes(currentUser);
}
