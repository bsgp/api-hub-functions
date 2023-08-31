module.exports = async (draft) => {
  const { builder } = draft.pipe.ref;
  const { dbTable, dbRecordList, rfcResponse, dbKeyFields } = draft.pipe.json;
  const { knex } = builder;

  const ZXMSGS = [
    rfcResponse.body.result.E_IFRESULT,
    rfcResponse.body.result.E_IFFAILMSG,
  ]
    .filter(Boolean)
    .join(",");

  const length = dbRecordList.length;

  // ZXSTAT: "S",
  // ZXDATS: knex.raw("CONVERT(CHAR(8),GETDATE(),112)"),
  // ZXTIMS: knex.raw("REPLACE(CONVERT(CHAR(8),GETDATE(),108),':','')"),
  // ZXMSGS: "",

  const multiQuery = builder.multi(dbTable);
  for (let index = 0; index < length; index += 1) {
    const each = dbRecordList[index];
    multiQuery.add(function () {
      const subQuery = this.update({
        ZXSTAT: "S",
        ZXDATS: knex.raw("CONVERT(CHAR(8),GETDATE(),112)"),
        ZXTIMS: knex.raw("REPLACE(CONVERT(CHAR(8),GETDATE(),108),':','')"),
        ZXMSGS,
      }).returning(["ZXSTAT", "ZXDATS", "ZXTIMS", "ZXMSGS"]);
      dbKeyFields.forEach((keyField) => {
        subQuery.where({ [keyField]: each[keyField] });
      });
    });
  }
  // await multiQuery.run();
  const updateToR = await multiQuery.run();

  // const updateQuery = builder.update(dbTable, );
  // // await updateQuery.run();
  // updateQuery.toString();

  try {
    draft.pipe.json.resultList.push(...updateToR.body.list);
  } catch (ex) {
    draft.pipe.json.resultList.push(updateToR);
  }
};
