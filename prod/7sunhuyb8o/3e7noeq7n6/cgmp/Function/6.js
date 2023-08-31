module.exports = async (draft, { fn, request }) => {
  const iStocks = draft.json.iStocks;
  const reqCount = draft.json.reqCount + 1;
  const flowID = "get_confirmationjournal";
  draft.json.loopBody = {
    ...draft.json.loopBody,
    resultUploadKey: fn.getKey({
      flowID,
      id: draft.json.uploadKeys[reqCount],
      dateArr: request.requestTime,
    }),
    identifiedStockID: iStocks[reqCount],
  };

  draft.json.reqCount = reqCount;
};
