module.exports = async (draft, { request, glue }) => {
  const colObjects = {
    requesttime: {
      type: "string",
    },
    starttime: {
      type: "string",
    },
    endtime: {
      type: "string",
    },
    duration: {
      type: "int",
    },
    requestid: {
      type: "string",
    },
    node: {
      type: "string",
    },
    dt: {
      type: "string",
    },
    tag: {
      type: "string",
    },
    loggroupname: {
      type: "string",
    },
    logstreamname: {
      type: "string",
    },
    msg: {
      type: "string",
    },
    logeventbase64: {
      type: "string",
    },
    scope: {
      type: "string", // (Partitioned)
    },
    dt2: {
      type: "string", // (Partitioned)
    },
    flow: {
      type: "string", // (Partitioned)
    },
    qualifier: {
      type: "string", // (Partitioned)
    },
    method: {
      type: "string", // (Partitioned)
    },
    path: {
      type: "string", // (Partitioned)
    },
  };

  // "scope", "flow", "qualifier", "method", "path"
  let partitionKeys = ["dt2"];
  if (request.body.Prefix === "minutely") {
    // pass
  } else {
    partitionKeys = ["scope"].concat(partitionKeys);
  }

  const projections = {
    scope: {
      type: "injected",
    },
    dt2: {
      format: "yyyy/MM/dd/HH/mm",
      interval: "1",
      "interval.unit": "MINUTES",
      type: "date",
      range: "2021/09/01/00/00,NOW",
    },
    flow: {
      type: "injected",
    },
    qualifier: {
      type: "injected",
    },
    method: {
      type: "enum",
      values: "GET,POST,PATCH,DELETE,PUT,UNKNOWN,TASK",
    },
    path: {
      type: "injected",
    },
  };
  switch (request.body.DtType) {
    case "hourly":
      projections.dt2.format = "yyyy/MM/dd/HH";
      projections.dt2["interval.unit"] = "HOURS";
      projections.dt2.range = "2021/09/01/00,NOW";
      break;
    case "daily":
      projections.dt2.format = "yyyy/MM/dd";
      projections.dt2["interval.unit"] = "DAYS";
      projections.dt2.range = "2021/09/01,NOW";
      break;
    default:
      break;
  }

  const dbName = ["api_log", request.stage].join("_");
  const tableName = [
    ...(request.body.Prefix === "minutely"
      ? ["base_min"]
      : ["base", request.body.Prefix]),
    request.body.DtType,
  ]
    .filter(Boolean)
    .join("_");
  const result = await glue.table.create(tableName, {
    dbName,
    dataType: "json",
    prefix: [
      ["api-hub", request.body.Prefix].filter(Boolean).join("-"),
      request.stage,
    ]
      .filter(Boolean)
      .join("/"),
    bucket: "log-bsg.support",
    columns: Object.keys(colObjects)
      .filter((fieldName) => !partitionKeys.includes(fieldName))
      .map((fieldName) => {
        // if (partitionKeys.includes(fieldName)) {
        //   return {
        //     name: [fieldName, "origin"].join("_"),
        //     type: colObjects[fieldName].type,
        //     text: [
        //       colObjects[fieldName].abapType,
        //       colObjects[fieldName].text,
        //     ].join(" "),
        //   };
        // } else {
        return {
          name: fieldName,
          type: colObjects[fieldName].type,
          // text: [
          //   colObjects[fieldName].abapType,
          //   colObjects[fieldName].text,
          // ].join(" "),
        };
        // }
      }),
    partitions: partitionKeys.map((fieldName) => {
      return {
        name: fieldName,
        type: colObjects[fieldName].type,
        // text: [
        // colObjects[fieldName].abapType, colObjects[fieldName].text].join(
        //   " "
        // ),
      };
    }),
    projection: partitionKeys.map((fieldName) => {
      return {
        fieldName,
        ...projections[fieldName],
      };
    }),
  });

  draft.response.body = result;
};
