var utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

module.exports = async (draft, { request, lib }) => {
  const { dayjs, isTruthy } = lib;
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const kst = dayjs(request.requestTimeUTC).tz("Asia/Seoul");

  const { builder } = draft.ref;

  const query = builder.select(draft.json.dbTableName);
  if (draft.json.partitionKey) {
    if (draft.json.partitionKey !== "ignore") {
      const multiPKey = draft.json.partitionKey.split("+");
      if (multiPKey.length > 1) {
        multiPKey.forEach((eachPKey) => {
          query.whereNotNull(eachPKey);
        });
      } else {
        query.whereNotNull(draft.json.partitionKey);
      }
    }
  }
  // query.where({ detail_seq: 1096 });

  query.limit(100000);
  switch (draft.json.ifId) {
    case "IF-WISH-001":
    case "IF-WISH-002":
      if (isTruthy(request.body.Data)) {
        query.whereBetween("chk_date", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        query.whereBetween("chk_date", [
          kst.subtract(1, "months").format("YYYY-MM-DD"),
          kst.format("YYYY-MM-DD"),
        ]);
      }
      break;
    case "IF-SECOM-001":
      // query.whereBetween("date", [
      //   kst.subtract(1, "months").format("YYYYMMDD"),
      //   kst.format("YYYYMMDD"),
      // ]);
      break;
    case "IF-EHR-001":
      if (isTruthy(request.body.Data)) {
        query.whereBetween("ymd", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        // query.where("ymd", "2022-07-01");
        query.whereBetween("ymd", [
          kst.subtract(1, "months").format("YYYY-MM-DD"),
          kst.format("YYYY-MM-DD"),
        ]);
      }
      // query.where("ymd", ">=", "2022-07-01");
      // query.where("ymd", "<=", "2022-07-07");
      break;
    case "IF-EHR-003":
      if (isTruthy(request.body.Data)) {
        query.whereBetween("YMD", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        // query.where("ymd", "2022-07-01");
        query.where("YMD", kst.format("YYYY-MM-DD"));
      }
      break;
    case "IF-EHR-004":
      if (isTruthy(request.body.Data) && request.method !== "TASK") {
        query.whereBetween("YMD", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        // query.where("ymd", "2022-07-01");
        if (request.body.Data.second === true) {
          const kstDate = kst.format("DD");
          const nowIsLastDay = kstDate === kst.endOf("month").format("DD");
          if (["10", "17", "24"].includes(kstDate) || nowIsLastDay) {
            query.whereBetween("YMD", [
              kst.startOf("month").format("YYYY-MM-DD"),
              kst.format("YYYY-MM-DD"),
            ]);
            const prevMonthKst = kst.startOf("month").subtract(1, "months");
            query.orWhereBetween("YMD", [
              prevMonthKst.format("YYYY-MM-DD"),
              prevMonthKst.endOf("month").format("YYYY-MM-DD"),
            ]);
          }
        } else {
          query.whereBetween("YMD", [
            kst.subtract(3, "days").format("YYYY-MM-DD"),
            kst.format("YYYY-MM-DD"),
          ]);

          const nowIsLastDay =
            kst.format("DD") === kst.endOf("month").format("DD");
          if (nowIsLastDay) {
            const prevMonthKst = kst.startOf("month").subtract(1, "months");
            query.orWhereBetween("YMD", [
              prevMonthKst.format("YYYY-MM-DD"),
              prevMonthKst.endOf("month").format("YYYY-MM-DD"),
            ]);
          }
        }
      }
      break;
    case "IF-ENMS-001":
      if (isTruthy(request.body.Data)) {
        query.where("yy", request.body.Data.yy);
        if (request.body.Data.mm) {
          query.where("mm", request.body.Data.mm);
        }
      } else {
        query.where(function () {
          this.where(function () {
            this.where("yy", kst.subtract(1, "months").format("YYYY"));
            this.where("mm", kst.subtract(1, "months").format("MM"));
          }).orWhere(function () {
            this.where("yy", kst.format("YYYY"));
            this.where("mm", kst.format("MM"));
          });
        });
      }
      // query.where("ymd", ">=", "2022-07-01");
      // query.where("ymd", "<=", "2022-07-07");
      break;
    default:
      break;
  }

  const result = await query.run();

  draft.json.dbResult = result.body;
  draft.response = result;
};
