module.exports = async (draft) => {
  const isTest = false;
  const pid = isTest ? "my358322" : "my359276";
  draft.pipe.json.isTest = isTest;
  draft.pipe.json.username = "bsg";
  draft.pipe.json.password = isTest ? "Welcome123" : "Welcome0";
  draft.pipe.json.reportNum = "RPSCMINVV02_Q0001";
  draft.pipe.json.pid = pid;
  draft.pipe.json.targetLogisticsArea = [
    "ACCESS_2",
    "B10_2",
    "CUTINDES_2",
    "FLAVOR_2",
    "FORM_FILL_SEAL_2",
    "SAMPLE_2",
    "TRIGGER_2",
    "WAXING_2",
    "WINDING_2",
    "MULTIPACK_2",
  ];
  draft.response.body = { pid };
};
