module.exports = async (draft, { file, request }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  switch (request.method) {
    case "GET": {
      const { path } = request.body;
      if (!path) {
        setFailedResponse("Parameter 'path' is missing");
        return;
      }
      draft.response.body = await file.get(path, {
        // gziped: true,
        toJSON: true,
      });
      break;
    }
    case "POST": {
      const { path, content } = request.body;
      if (!path) {
        setFailedResponse("Parameter 'path' is missing");
        return;
      } else if (typeof content !== "object") {
        setFailedResponse("Object 'content' is missing");
        return;
      }
      draft.response.body = await file.upload(path, JSON.stringify(content), {
        gziped: true,
      });
      break;
    }
    default: {
      setFailedResponse("Check request method and try again");
      return;
    }
  }
};

/*
  [CMS 데이터 파일 목록]
  /cms/setting_config/companyID.json
  /cms/setting_config/taxCodeList.json
  /cms/setting_config/ledgerList.json
  /cms/setting_config/costCenterList.json
*/
