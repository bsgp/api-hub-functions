module.exports = async (draft, { request }) => {
  const ifId = draft.pipe.json.ifId;
  const nodeMaps = {
    IF_HR004: "Function#4",
    IF_HR005: "Function#14",
    IF_HR006: "Function#14",
    IF_GW003: "Function#16",
    IF_GW004: "Function#16",
    IF_GW005: "Function#16",
    IF_GW006: "Function#16",
    IF_GW007: "Function#16",
  };
  draft.pipe.json.nextNodeKey = nodeMaps[ifId];

  // if (request.stage === "prdd") {
  //   // if (ifId === "IF_GW003") {
  //   draft.pipe.json.nextNodeKey = "Function#8";
  //   // }
  // }

  // if (request.stage === "qas") {
  //   if (ifId === "IF_GW003") {
  //     draft.pipe.json.nextNodeKey = "Function#8";
  //   }
  // }

  const tableMaps = {
    IF_HR004: {
      ghr: request.body.DbTable,
    },
    IF_HR005: {
      ghr: request.body.DbTable,
      gw: "wf_ghr_signImg",
    },
    IF_HR006: {
      ghr: request.body.DbTable,
      gw: "WF_LEGACY_BIZTRIP",
    },
    IF_GW003: {
      ghr: "PW_IF_DEPT_GW_T",
      gw: request.body.DbTable,
    },
    IF_GW004: {
      ghr: "PW_IF_POSITION_GW_T",
      gw: request.body.DbTable,
    },
    IF_GW005: {
      ghr: "PW_IF_TITLE_GW_T",
      gw: request.body.DbTable,
    },
    IF_GW006: {
      ghr: "PW_IF_USER_GW_T",
      gw: request.body.DbTable,
    },
    IF_GW007: {
      ghr: "PW_IF_USER_ADL_GW_T",
      gw: request.body.DbTable,
    },
  };
  draft.pipe.json.table = tableMaps[ifId];
};
