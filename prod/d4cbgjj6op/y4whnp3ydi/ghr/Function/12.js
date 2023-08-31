module.exports = async (draft) => {
  draft.pipe.json.keyColumns = ["UserCode"];

  const { table } = draft.pipe.json;

  const resultGw = draft.response;

  const entriesGhr = resultGw.body.list.map((each) => ({
    COMPANY: each.CompanyCode,
    EMPNO: each.EmpNo,
    SIGN_IMG: each.SignImg,
  }));

  const builder = draft.pipe.ref.builderGhr;

  const query = builder.multi(table.ghr);
  entriesGhr.forEach((each) => {
    query.add(function () {
      const data = {
        COMPANY: each.COMPANY,
        EMPNO: each.EMPNO,
        SIGN_IMG: builder.knex.raw(":SIGN_IMG"),
        // SIGN_IMG: Buffer.from(each.SIGN_IMG, "base64").toJSON(),
      };

      this.insert(data);
      // this.raw(query.knex.raw(sqlStatement, { data }));
      query.bindings.push({ SIGN_IMG: each.SIGN_IMG });
    });
  });
  const result = await query.run();

  draft.response = result;
  draft.pipe.ref.resultGw = resultGw;
};
