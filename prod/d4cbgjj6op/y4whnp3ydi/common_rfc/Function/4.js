module.exports = async (draft, { request, env, lib }) => {
  if (draft.response.body.errorMessage) {
    return;
  }

  const { tryit } = lib;
  const { body, requestTimeArray, stage, qualifier } = request;

  let newStage = "";
  const requestTime = requestTimeArray.join("-");
  // {"ashost": "10.85.114.76","sysnr": "00","client": "700",
  // "user": "PS4_ADMIN","passwd": "Dnamotors1!","lang": "ko"};

  switch (stage) {
    case "qas": {
      newStage = "qas";
      break;
    }
    case "prd": {
      if (requestTime >= "2021-09-30-15-00") {
        newStage = "prd_100";
        break;
      } else if (
        requestTime >= "2021-09-29-03-00" &&
        ["IF_HR001", "IF_HR002", "IF_HR003"].includes(body.InterfaceId)
      ) {
        newStage = "prd_100";
        break;
      } else if (
        [
          "IF_GW001",
          "IF_GW002",
          "CO-002",
          "CO-003",
          "CO-004",
          "CO-005",
          "CO-006",
        ].includes(body.InterfaceId)
      ) {
        newStage = "prd_100";
        break;
      }
      draft.response.body = {
        errorMessage: "stage 'prd' is not allowed before the GoLive",
      };

      draft.response.statusCode = 400;
      return;
    }
    case "staging": {
      newStage = "qas";
      break;
    }
    case "prod": {
      newStage = "qas";
      if (requestTime >= "2021-10-04-15-00") {
        newStage = "prd_100";
      } else if (["PRM-001", "PRM-059"].includes(body.InterfaceId)) {
        newStage = "prd_100";
      }
      if (qualifier === "staging") {
        newStage = "qas";
      } else if (qualifier === "dev") {
        newStage = "dev";
      }
      break;
    }
    case "dev":
      newStage = "dev";
      break;
    default: {
      draft.response.body = {
        errorMessage: "invalid headers.stage",
      };

      draft.response.statusCode = 400;
      return;
    }
  }

  const config = JSON.parse(env[["SAP", newStage.toUpperCase()].join("_")]);

  const lang = tryit(() => body.Lang);

  draft.pipe.json.newStage = newStage;
  draft.pipe.json.connection = {
    ...config,
    codepage: "4103",
    ...(lang ? { lang } : {}),
  };
};

// draft.pipe.json.connection = {
//   // dest: "EAIRFC",
//   wshost: "sapdev.dnamotors.co.kr",
//   // wshost: "3.35.102.230",
//   // wshost: "52.79.53.170",
//   // wshost: [
//   //   "lb-HEC55-DNM-ext-IB-nonprod-1941797145",
//   //   "ap-northeast-2.elb.amazonaws.com",
//   // ].join("."),
//   wsport: "443",
//   // sysnr: "00",
//   // use_tls: "1",
//   tls_client_pse: "/var/task/lib-js/dnm.pse",
//   // tls_client_certificate_logon: "1",
//   // tls_trust_all: "1",
//   client: "100",
//   // user: "RFC_PRM3",
//   // alias_user: "IF_PRM3",
//   passwd: "Qwer@12345",
//   lang: "ko",
// };
