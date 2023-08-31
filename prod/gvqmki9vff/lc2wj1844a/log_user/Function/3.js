module.exports = async (draft, { sql }) => {
  const { table } = draft.pipe.json;
  try {
    const query = sql("mysql").select(table);
    const queryKey = Object.keys(query);

    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `Get data from log DB`,
      queryKey,
      // result: result.body
    };

    // const result = await query.run();
    // if (result.statusCode === 200) {
    //   draft.response.body = {
    //     E_STATUS: "S",
    //     E_MESSAGE: `Get data from log DB`,
    //     queryKey,
    //     result: result.body
    //   };
    // } else {
    //   draft.response.body = {
    //     E_STATUS: "F",
    //     E_MESSAGE: `Failed Get data from log DB`,
    //     result: result.body
    //   };
    // }
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed Get data`,
      error,
    };
  }
};
