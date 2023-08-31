module.exports = async (draft, { sql, user }) => {
  const routeTo = {
    exit: "Output#2",
  };
  // const setFailedResponse = (msg, statusCd = 400) => {
  //   draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
  //   draft.response.statusCode = statusCd;
  //   draft.json.nextNodeKey = routeTo.exit;
  // };

  const { tableName, primaryKeys } = draft.json.tableConfig;
  // const { added, added_trimmed } = draft.json.modifiedData;
  // if (added.length === 0 && added_trimmed.length === 0) {
  //   draft.json.nextNodeKey = routeTo.exit;
  //   return;
  // }
  const { added } = draft.json.modifiedData;
  if (added.length === 0) {
    draft.json.nextNodeKey = routeTo.exit;
    return;
  }

  const mysql = sql("mysql");

  // 1. 기존 데이터들에서 USAGE_DATE_TO & USAGE_STATUS 업데이트
  // const promisesForUpdate = [];
  // added_trimmed.forEach((trimmedItem) => {
  //   const dateObjTo = new Date(trimmedItem.USAGE_DATE_FROM);
  //   dateObjTo.setDate(dateObjTo.getDate() - 1);

  //   const data = {
  //     UPDATED_AT: new Date(),
  //     UPDATED_BY: user.id,
  //     USAGE_DATE_TO: dateToString(dateObjTo),
  //     USAGE_STATUS: "no",
  //   };

  //   promisesForUpdate.push(
  //     mysql
  //       .update(tableName, data)
  //       .where({
  //         CARD_NUMBER: trimmedItem.CARD_NUMBER,
  //         CARD_USER_ID: trimmedItem.CARD_USER_ID,
  //       })
  //       .onConflict(primaryKeys)
  //       .ignore()
  //       .run()
  //   );
  // });

  // const resultOfUpdate = await Promise.all(promisesForUpdate);

  // 2. 새 데이터들을 insert
  added.forEach((item) => {
    delete item.DELETED;
    item.CREATED_BY = user.id;
    item.UPDATED_BY = user.id;
  });

  const resultOfInsert = await mysql
    .insert(tableName, added)
    .onConflict(primaryKeys)
    .ignore()
    .run();

  draft.json.nextNodeKey = routeTo.exit;
  // draft.response.body.E_MESSAGE.added = { resultOfUpdate, resultOfInsert };
  draft.response.body.E_MESSAGE.added = resultOfInsert;
};

// function dateToString(dateObj) {
//   const year = dateObj.getFullYear().toString();
//   const month = `000${dateObj.getMonth() + 1}`.slice(-2);
//   const date = `000${dateObj.getDate()}`.slice(-2);

//   return [year, month, date].join("-");
// }
