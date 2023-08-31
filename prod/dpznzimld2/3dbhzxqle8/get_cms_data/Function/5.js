module.exports = async (draft, { file, request, env, odata }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { path } = request.body;
  if (!path) {
    const pathList = [
      "companyID",
      "taxCodeList",
      "ledgerList",
      "costCenterList",
    ];
    const asyncTasks = [];
    pathList.forEach((item) => asyncTasks.push(getFileAsync(file, item)));

    const results = (await Promise.all(asyncTasks))
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);

    draft.response.body = {};
    results.forEach((value) => {
      if (value.name === "companyID") {
        draft.response.body["companyID"] = value.data.companyID;
      } else {
        draft.response.body[value.name] = value.data.items;
      }
    });
  } else {
    const { BYD_URL, BYD_ODATA_PATH, BYD_ID, BYD_PW } = env;

    const result = await getFileAsync(file, path);
    if (result.status === "rejected") {
      setFailedResponse(`Cannot find data of '${path}' (${result.reason})`);
      return;
    }
    if (path === "companyID") {
      const odataRes = await odata.get({
        url: [
          BYD_URL,
          BYD_ODATA_PATH,
          "cust/v1/company_name/CompanyCollection",
          "?$format=json",
          "&$expand=CompanyCurrentName",
          `&$filter=ID eq '${result.value.data.companyID}'`,
        ].join(""),
        username: BYD_ID,
        password: BYD_PW,
      });

      const odataResult = odataRes.d.results;

      if (
        !Array.isArray(odataResult) ||
        odataResult.length === 0 ||
        !odataResult[0].CompanyCurrentName
      ) {
        setFailedResponse(`회사이름을 불러 오는데 실패 했습니다.`);
        return;
      }

      draft.response.body = {
        ...result.value.data,
        companyName: odataResult[0].CompanyCurrentName[0].Name,
      };
    } else {
      draft.response.body = result.value.data.items;
    }
  }
};

async function getFileAsync(file, path) {
  try {
    const savedDataStr = await file.get(`cms/setting_config/${path}.json`);
    const contentMap = {
      name: path,
      data: JSON.parse(savedDataStr),
    };
    return { status: "fulfilled", value: contentMap };
  } catch (e) {
    return { status: "rejected", reason: e.message || "Failed to load file" };
  }
}
