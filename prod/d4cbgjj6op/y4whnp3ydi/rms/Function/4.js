module.exports = async (draft, { request, sql, env }) => {
  let stage = "";
  // {"ashost": "10.85.114.76","sysnr": "00","client": "700",
  // "user": "PS4_ADMIN","passwd": "Dnamotors1!","lang": "ko"};
  const requestTime = request.requestTimeArray.join("-");

  switch (request.stage) {
    case "qas": {
      stage = "qas";
      break;
    }
    case "prd": {
      if (requestTime >= "2021-09-30-15-00") {
        stage = "prd_100";
        break;
      } else if (["CO-001"].includes(request.body.InterfaceId)) {
        stage = "prd_100";
        break;
      }
      draft.response.body = {
        errorMessage: "stage 'prd' is not allowed before the GoLive",
      };

      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }
    case "dev":
      stage = "dev";
      break;
    default: {
      draft.response.body = {
        errorMessage: "invalid headers.stage",
      };

      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }
  }

  const config = JSON.parse(env[["SAP", stage.toUpperCase()].join("_")]);

  draft.pipe.json.connection = {
    ...config,
    codepage: "4103",
  };

  // const url = [
  //   "dna-seoul-rds-armsdbp01.ceh7ej2i50ty",
  //   ".ap-northeast-2.rds.amazonaws.com",
  // ].join("");
  const url = "rmsdb.ars.com";
  const port = "11521";

  // const ip = await lib.getIpViaDns("8.8.8.8", url);//"10.75.63.1"
  // const ip = await lib.getIpViaDns("203.226.47.14","rmsdb.ars.com", "CNAME");
  // draft.response.body = ip;
  // draft.pipe.json.terminateFlow = true;

  const rmsDbConfig = {
    url: url,
    port,
    user: "EAIAPP",
    password: "EAIapp123!",
    database: "RMSPRDDB",
    fetchDefaultValue: true,
    ns: "10.75.63.1",
    rrtype: "CNAME",
  };

  switch (request.stage) {
    case "dev": {
      // if (requestTime >= "2021-09-30-15-00") {
      //   draft.response.body = {
      //     errorMessage: [
      //       "stage 'dev','qas' is not allowed",
      //       "before RMS DB for Dev is ready",
      //     ].join(" "),
      //   };

      //   draft.response.statusCode = 400;
      //   draft.pipe.json.terminateFlow = true;
      //   return;
      // }
      // rmsDbConfig.url = [
      //   "prd-wrmsdevdb-oracle-19-9.ccyjjr0sqtkn",
      //   "ap-northeast-2.rds.amazonaws.com",
      // ].join(".");
      // rmsDbConfig.url = "11.104.10.194";
      rmsDbConfig.port = "1521";
      rmsDbConfig.url = "wrmsdevdb.wjcloud.co.kr";
      rmsDbConfig.database = "RMSDEVDB";
      delete rmsDbConfig.rrtype;
      delete rmsDbConfig.ns;
      break;
    }
    case "qas": {
      rmsDbConfig.url =
        "dna-seoul-rds-armsdbp01.ceh7ej2i50ty.ap-northeast-2.rds.amazonaws.com";
      rmsDbConfig.user = "DEV_ARS_RENTALAPP";
      rmsDbConfig.password = "ars#2021!!";
      delete rmsDbConfig.rrtype;
      delete rmsDbConfig.ns;
      break;
    }
    case "prd": {
      break;
    }
    default: {
      draft.response.body = {
        errorMessage: "invalid headers.stage",
      };

      draft.response.statusCode = 400;
      draft.pipe.json.terminateFlow = true;
      return;
    }
  }

  const builder = sql("oracle", rmsDbConfig);

  draft.pipe.ref.builder = builder;
  draft.pipe.json.table = request.body.DbTable;
  draft.pipe.json.ifId = request.body.InterfaceId;
};
