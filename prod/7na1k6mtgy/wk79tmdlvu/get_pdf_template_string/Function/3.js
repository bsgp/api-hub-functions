module.exports = async (draft, { request, file }) => {
  const { path } = request.body;

  let response_body = {
    E_STATUS: "S",
    E_MSG: "Saved",
    E_DATA: {},
    E_PATH: { path: path },
  };

  switch (request.method) {
    case "GET": {
      try {
        const templateJSON = await file.get(path);

        response_body = {
          E_STATUS: "S",
          E_MSG: "GET IS DONE",
          E_DATA: { templateJSON: templateJSON },
          E_PATH: { path: path },
        };
      } catch (err) {
        response_body = {
          E_STATUS: "F",
          E_MSG: "GET IS FAILED",
          E_DATA: { err: err },
          E_PATH: { path: path },
        };
      }
      break;
    }

    default: {
      response_body = "Default value is returned";
    }
  }

  draft.response.body = response_body;
};
