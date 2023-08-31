module.exports = async (draft, { request, sql, lib }) => {
  const ifId = request.body.InterfaceId;

  const configGhr = {
    // url: "3.37.85.61:1521",
    // url: "hrdb.dnamotors.co.kr",
    url: "hrapp.dnadev.bike",
    port: "1521",
    user: "HCMIF",
    password: "qwer12#$",
    database: "DNAMDEV",
    ns: "10.75.63.1",
    rrtype: "A",
  };
  if (request.stage === "prd") {
    configGhr.url = "hrdb.dnamotors.co.kr";
    configGhr.database = "DNAMPRD";
    configGhr.password = "dna12#$";
  }
  const builderGhr = sql("oracle", configGhr);
  const dbGw = {
    IF_HR005: "covi_approval4j",
    IF_HR006: "covi_approval4j",
  };
  const configGw = {
    // host: "10.85.81.11",
    // host: "gwdb.dnamotors.co.kr",
    host: "gwapp.dnadev.bike",
    port: "3306",
    user: "eaiuser",
    password: "DNAeai12@!",
    database: dbGw[ifId] || "covi_syncdata",
    ns: "10.75.63.1",
    rrtype: "A",
  };
  if (request.stage === "prd") {
    configGw.host = "gwdb.dnamotors.co.kr";
    configGw.password = "dnaEAI13#!";
  }
  const builderGw = sql("mysql", configGw);

  draft.pipe.ref.builderGhr = builderGhr;
  draft.pipe.ref.builderGw = builderGw;
  draft.pipe.json.ifId = ifId;

  const [yyyy, mm, dd, hh, mi, ss] = lib.adjustTime(request.requestTimeUTC, {
    hours: 9,
  });
  draft.pipe.json.currentTimeString = [yyyy, mm, dd, hh, mi, ss].join("");
};
