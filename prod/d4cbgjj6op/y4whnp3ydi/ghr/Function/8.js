module.exports = async (draft) => {
  const { table } = draft.pipe.json;

  const { builderGhr } = draft.pipe.ref;
  const queryGhr = builderGhr.select(table.ghr);
  queryGhr.where("TRANSFER_STATUS", "S");

  const resultGhr = await queryGhr.run();
  draft.response = resultGhr;

  // const { builderGw } = draft.pipe.ref;
  // const queryGw = builderGw.select(table.gw);

  // const resultGw = await queryGw.run();
  // draft.response = resultGw;
};
