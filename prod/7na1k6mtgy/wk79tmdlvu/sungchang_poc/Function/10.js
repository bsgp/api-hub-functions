module.exports = async (draft, { request, sql }) => {
  const { method } = request;

  let resBody = {
    E_STATUS: "",
    E_MESSAGE: "",
    E_DATA: [],
  };

  const query = sql("mysql");

  if (method === "POST") {
    // 현재 들어온 데이터와 기존의 데이터를 연결해서 보내줘야 한다
    //   const def_table = await query.select("def_table6").run();
    // const opr_table = await query.select("opr_table6").run();
    // const mapping_table = await query.select("mapping_table7").run();
    // const data_table = await query.select("data_table12").run();

    const joinTest = await query
      .select()
      .from("mapping_table7")
      .leftJoin("def_table6", "CD_DEF", "KEY_JSON.CD_DEF")
      .leftJoin("opr_table6", "TXT_OPR", "TXT_OPR")
      .run();

    // const result = cells.reduce(
    //   (acc, each) => {
    //     const key = getKey(each.rowIndex, each.columnIndex);
    //     const mappingOne = mappingObject[key];

    //     if (mappingOne) {
    //       const value = each.cellTextLines
    //         .map((cell) => cell.cellWords[0].inferText)
    //         .join("");

    //       if (mappingOne.field) {
    //         acc.fields[key] = value;
    //       } else {
    //         const newData = { ...mappingOne, value };
    //         acc.rows.push(newData);
    //       }
    //     }

    //     return acc;
    //   },
    //   { rows: [], fields: {} }
    // );

    // const dataRows = result.rows.map((each) => {
    //   return {
    //     ...each,
    //     SPEC: result.fields[each.SPEC],
    //     PRODUCT: result.fields[each.PRODUCT],
    //     DATE_YMD: date,
    //     FILE_URL: fileUrl,
    //   };
    // });

    // await query
    //   .insert("data_table12", dataRows)
    //   .onConflict([
    //     "FILE_URL",
    //     "DATE_YMD",
    //     "SPEC",
    //     "PRODUCT",
    //     "TEAM",
    //     "MACHINE",
    //     "CD_DEF",
    //   ])
    //   .merge()
    //   .run();

    resBody = {
      E_STATUS: "T",
      E_MESSAGE: "TEST",
      E_DATA: { joinTest },
    };

    //   list = await query
    // .select()
    // .from("data_table12")
    // .whereIn(["FILE_URL"], [[fileUrl]])
    // .run();

    // list = await query
    // .select()
    // .from("data_table12")
    // .whereBetween("DATE_YMD", [startDate, endDate])
    // .run();
  }
  draft.response.body = resBody;
};
