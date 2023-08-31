module.exports = async (draft) => {
  const { table, ifId } = draft.pipe.json;

  const { builderGw } = draft.pipe.ref;

  const queryGw = builderGw.select(table.gw);
  queryGw.where("TRANS_STATUS", "N");

  const resultGw = await queryGw.run();
  draft.response = resultGw;

  if (resultGw.body.count === 0) {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table.ghr,
      E_STATUS: "F",
      E_MESSAGE: "전송할 데이터가 없습니다",
    };
    draft.pipe.json.terminateFlow = true;
  }

  const nodeMaps = {
    IF_HR005: "Function#12",
    IF_HR006: "Function#13",
  };
  draft.pipe.json.nextNodeKey = nodeMaps[ifId];
};
