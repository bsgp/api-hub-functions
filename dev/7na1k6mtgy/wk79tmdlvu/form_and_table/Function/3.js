module.exports = async (draft, { request, file }) => {
  const { url } = request.body;

  let response_body = {
    E_STATUS: "S",
    E_MSG: "Saved",
    E_DATA: {},
    E_PATH: { url: url },
  };

  switch (request.method) {
    case "GET": {
      try {
        const templateJSON = await file.get(url, { toJSON: true });

        response_body = {
          E_STATUS: "S",
          E_MSG: "GET IS DONE",
          E_DATA: { templateJSON: templateJSON },
          E_PATH: { url: url },
        };
      } catch (err) {
        response_body = {
          E_STATUS: "F",
          E_MSG: "GET IS FAILED",
          E_DATA: { err },
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
