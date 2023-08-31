module.exports = async (draft, { request, sql, log }) => {
  const { method, table } = draft.pipe.json;

  if (method !== "PATCH") {
    return;
  }

  const rowData = request.body.data;

  if (!Array.isArray(rowData)) {
    sendErrRes("patch data should be array type.");
    return;
  }

  if (!rowData.length) {
    sendErrRes("patch data should have one row at least.");
    return;
  }

//   const builder = sql("mysql");
//   const updateTimeMappedData = rowData.map(each => {
//     return {
//       ...each,
//       UPDATED_AT: builder.fn.now(6)
//     };
//   })
  
//   const prms = updateTimeMappedData.map(each => {
//     const { JOB_ID, USER_ID } = each;
//     return sql("mysql").update(table, each).where({ JOB_ID, USER_ID }).run();
//   });
//   await Promise.all(prms);

//   draft.response = await builder
//     .insert(table, updateTimeMappedData)
//     .onConflict()
//     .merge()
//     .run();

  const mysql = sql("mysql");
  const multiBuilder = mysql.multi(table);
  rowData.map(each => {
    return {
      ...each,
      UPDATED_AT: mysql.fn.now(6)
    };
  }).forEach(each => {
      multiBuilder.add(function() {
        this.update(each).where({ UUID: each.UUID });
      })
  });

  draft.response = await multiBuilder.run();

  function sendErrRes(errorMessage) {
    draft.response.statusCode = 400;
    draft.response.body = {
      errorMessage
    };
  }
};
