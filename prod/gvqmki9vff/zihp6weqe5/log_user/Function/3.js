module.exports = async (draft, { sql }) => {
  const { table } = draft.pipe.json;
  try {
    const query = sql("mysql").select(table);
    query.column("CREATED_BY", "CREATED_AT").select();
    query.orderBy("CREATED_AT", "desc");

    const result = await query.run();

    if (result.statusCode === 200) {
      const list = result.body.list;
      const filter = list
        .filter(
          (item, idx) =>
            list.findIndex((it) => it.CREATED_BY === item.CREATED_BY) === idx
        )
        .map((item) => ({
          userID: item.CREATED_BY,
          lastSavedTime: item.CREATED_AT,
        }));
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: `Get data from log DB`,
        result: {
          count: filter.length,
          list: filter,
        },
      };
    } else {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Failed Get data from log DB`,
        result: result.body,
      };
    }
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed Get data`,
      error,
    };
  }
};
