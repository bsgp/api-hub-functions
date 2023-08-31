module.exports = async (draft, { sql, user }) => {
  const routeTo = {
    exit: "Output#2",
    insert: "Function#7",
  };
  // const setFailedResponse = (msg, statusCd = 400) => {
  //   draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
  //   draft.response.statusCode = statusCd;
  //   draft.json.nextNodeKey = routeTo.exit;
  // };

  const { tableName, primaryKeys } = draft.json.tableConfig;

  const { updated } = draft.json.modifiedData;
  if (updated.length === 0) {
    draft.json.nextNodeKey = routeTo.insert;
    return;
  }

  const mysql = sql("mysql");
  const promises = [];

  updated.forEach((item) => {
    delete item.DELETED;
    const cond = { DELETED: false };
    const data = {
      UPDATED_AT: new Date(),
      UPDATED_BY: user.id,
    };

    const keyList = Object.keys(item);
    keyList.forEach((key) => {
      if (primaryKeys.includes(key)) {
        cond[key] = item[key];
      } else {
        data[key] = item[key];
      }
    });

    promises.push(
      mysql
        .update(tableName, data)
        .where(cond)
        .onConflict(primaryKeys)
        .ignore()
        .run()
    );
  });

  const result = await Promise.all(promises);

  draft.json.nextNodeKey = routeTo.insert;
  draft.response.body.E_MESSAGE.updated = result;
};
