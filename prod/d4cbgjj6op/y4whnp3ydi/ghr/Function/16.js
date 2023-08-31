module.exports = async (draft) => {
  const { builderGhr } = draft.pipe.ref;
  const { table, ifId } = draft.pipe.json;

  const queryGhr = builderGhr.select(table.ghr);
  queryGhr.where("TRANSFER_STATUS", "N");

  const resultGhr = await queryGhr.run();
  draft.response = resultGhr;

  if (resultGhr.body.count === 0) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "전송할 데이터가 없습니다",
    };
    draft.pipe.json.terminateFlow = true;
  } else if (resultGhr.body.errorNum) {
    const { errorNum, message } = resultGhr.body;
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `ErrorNumber:${errorNum},Message:${message}`,
    };
    draft.pipe.json.terminateFlow = true;
  }

  const nodeMaps = {
    IF_GW003: "Function#7",
    IF_GW004: "Function#9",
    IF_GW005: "Function#10",
    IF_GW006: "Function#11",
    IF_GW007: "Function#17",
  };
  draft.pipe.json.nextNodeKey = nodeMaps[ifId];
};
