module.exports = async (draft, { request, sql }) => {
  const wishIp = { dev: "192.168.132.86", prod: "192.168.11.58" };
  const wishInfo = {
    dev: { user: "sa", password: "techn0$b" },
    prod: { user: "bsgadmin", password: "bsgadmin!@" },
  };
  const ehrIp = { dev: "192.168.132.201", prod: "192.168.132.201" };
  // "192.168.11.50"
  const ehrInfo = {
    dev: { user: "bsgadmin", password: "bsgadmin!@" },
    prod: { user: "bsgadmin", password: "bsgadmin!@" },
  };

  const enmsIp = { dev: "192.168.11.180", prod: "192.168.11.180" };
  const enmsInfo = {
    dev: { user: "PMS", password: ".1q2w3e4rQQ." },
    prod: { user: "PMS", password: ".1q2w3e4rQQ." },
  };

  const secomIp = { dev: "192.168.11.77", prod: "192.168.11.77" };
  //211.194.150.21
  const secomInfo = {
    dev: { user: "bsgadmin", password: "bsgadmin!@" },
    prod: { user: "bsgadmin", password: "bsgadmin!@" },
  };

  const dbConfig = {
    user: "sa",
    port: 1433,
    password: "techn0$b",
    database: "ESH_DB",
    url: wishIp[request.stage],
  };

  const [, dbSys] = draft.json.ifId.split("-");

  if (dbSys === "EHR") {
    dbConfig.url = ehrIp[request.stage];
    dbConfig.database = "Soulbrain_IF_DB";

    dbConfig.user = ehrInfo[request.stage].user;
    dbConfig.password = ehrInfo[request.stage].password;
  } else if (dbSys === "ENMS") {
    dbConfig.url = enmsIp[request.stage];
    dbConfig.database = "FEMS_V1";

    dbConfig.user = enmsInfo[request.stage].user;
    dbConfig.password = enmsInfo[request.stage].password;
  } else if (dbSys === "SECOM") {
    dbConfig.url = secomIp[request.stage];
    dbConfig.database = "SB_SECU";

    dbConfig.user = secomInfo[request.stage].user;
    dbConfig.password = secomInfo[request.stage].password;
  } else {
    dbConfig.user = wishInfo[request.stage].user;
    dbConfig.password = wishInfo[request.stage].password;
  }

  const builder = sql("mssql", dbConfig);
  draft.ref.builder = builder;
};
