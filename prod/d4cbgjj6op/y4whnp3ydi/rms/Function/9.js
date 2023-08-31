module.exports = async (draft) => {
  const ifId = draft.pipe.json.ifId;
  const maps = {
    IF_RM001: "Function#6",
    IF_RM002: "Function#7",
    IF_RM003: "Function#19",
    IF_RM004: "Function#8",
    IF_RM005: "Function#11",
    IF_RM006: "Function#12",
    IF_RM008: "Function#23",
    IF_RM009: "Function#13",
    IF_RM011: "Function#14",
    IF_RM012: "Function#20",
    IF_RM013: "Function#24",
    IF_RM014: "Function#25",
    IF_RM201: "Function#17",
    IF_RM202: "Function#18",
    "CO-001": "Function#15",
    "CO-007": "Function#16",
    "PRM-143": "Function#22",
  };
  draft.pipe.json.nextNodeKey = maps[ifId];
};
