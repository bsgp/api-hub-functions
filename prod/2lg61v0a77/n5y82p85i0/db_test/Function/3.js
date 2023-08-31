module.exports = async (draft, { dynamodb, request }) => {
  try {
    const result = await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: "bkpf/0706",
        id: "1_bkpf_0706",
      },
      {
        avgDuration: 10007,
        lOcKkEy: request.body.LockKey,
      },
      {
        operations: {
          avgDuration: "ADD",
        },
      }
      // updateData(draft.json.data, draft.json.lastDuration)
    );

    draft.response.body = result;
  } catch (ex) {
    if (ex.FailedReasons.includes("LockKeyNotMatched")) {
      draft.response.body = { result: "LockKeyNotMatched" };
    } else {
      throw ex;
    }
  }
};
