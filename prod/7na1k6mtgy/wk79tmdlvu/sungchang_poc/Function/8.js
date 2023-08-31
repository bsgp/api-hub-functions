module.exports = async (draft, { request, sql }) => {
  const { body, method } = request;
  const { tbOpr, tbDef, tbMap, tbData } = draft.json;

  let resBody = {
    E_STATUS: "",
    E_MESSAGE: "",
    E_DATA: [],
  };

  const query = sql("mysql");

  if (method === "POST") {
    // fielUrl과 날짜를 기준으로 중복자료를 검토
    const { fileUrl, images } = body;
    const getKey = (row, col) => [row, col].join("_");

    const tables = [...images.tables][0];
    const cells = [...tables.cells];

    const fields = [...images.fields];
    const values = [...fields];

    const date = values
      .reduce((acc, value, idx, arr) => {
        if (["년", "월", "일"].includes(value.inferText)) {
          let dateNumber = arr[idx - 1].inferText;
          if (parseInt(dateNumber) < 10) {
            dateNumber = `0${dateNumber}`;
          }
          acc.push(dateNumber);
        }
        return acc;
      }, [])
      .join("-");

    // await query.delete(tbData).where("file_url", fileUrl).run();
    // const items = await query
    //   .select()
    //   .from(tbData)
    //   .where("file_url", fileUrl)
    //   .andWhere("date_ymd", date)
    //   .run();

    // if (items.body.count > 0) {
    // resBody = {
    //   E_STATUS: "SC_POC",
    //   E_MESSAGE: "File aleady exist.",
    //   E_DATA: { fileUrl },
    //   errorMessage: "File aleady exist",
    // };
    // }
    // else {
    // table join을 대신하는 로직
    const mapping_data = await query.select(tbMap).run();
    // const def_data = await query.select(tbDef).run();
    // const opr_data = await query.select(tbOpr).run();

    const mappingList = mapping_data.body.list;
    // const defList = def_data.body.list;
    // const oprList = opr_data.body.list;

    // const mapJoinDef = mappingList.map((each) => {
    //   let result;
    //   if (each.KEY_JSON.CD_DEF) {
    //     result = defList.reduce((acc, cur) => {
    //       if (cur.CD_DEF === each.KEY_JSON.CD_DEF) {
    //         acc = cur;
    //       }
    //       return acc;
    //     }, "");
    //     each.KEY_JSON = Object.assign(each.KEY_JSON, result);
    //   }

    //   return each;
    // });

    // const mapJoinDefJoinOpr = mapJoinDef.map((each) => {
    //   let result;
    //   if (each.KEY_JSON.CD_OPR) {
    //     result = oprList.reduce((acc, cur) => {
    //       if (cur.CD_OPR === each.KEY_JSON.CD_OPR) {
    //         acc = cur;
    //       }
    //       return acc;
    //     }, "");
    //   }
    //   each.KEY_JSON = Object.assign(each.KEY_JSON, result);
    //   return each;
    // });

    const mappingObject = mappingList.reduce((acc, each) => {
      const newEach = { ...each };
      delete newEach.row_idx;
      delete newEach.col_idx;

      acc[getKey(each.row_idx, each.col_idx)] = JSON.parse(newEach.key_json);

      return acc;
    }, {});

    const cellObjects = cells.reduce((acc, each) => {
      const key = getKey(each.rowIndex, each.columnIndex);

      acc[key] = each;

      return acc;
    }, {});

    const result = mappingList.reduce(
      (acc, mapObj) => {
        const key = getKey(mapObj.row_idx, mapObj.col_idx);
        // const key = getKey(each.rowIndex, each.columnIndex);
        // const mappingOne = mappingObject[key];
        const each = cellObjects[key];
        const mappingOne = JSON.parse(mapObj.key_json);

        // if (each) {
        const value = each
          ? each.cellTextLines
              .map((line) =>
                line.cellWords.map((word) => word.inferText).join(" ")
              )
              .join("\n")
          : "";

        if (mappingOne.field) {
          acc.fields[key] = value;
        } else {
          const intValue = parseInt(value, 10);
          const newData = { ...mappingOne };
          // delete newData.row_idx;
          // delete newData.col_idx;

          if (Number.isNaN(intValue)) {
            newData.char_value = value;
          } else {
            newData.value = intValue;
          }
          acc.rows.push(newData);
        }
        // } else {
        //   acc.missedKeys.push([key, each.rowIndex, each.columnIndex]);
        // }
        return acc;
      },
      { rows: [], fields: {}, missedKeys: [] }
    );

    const dataRows = result.rows.map((each) => {
      return {
        ...each,
        file_url: fileUrl,
        spec: result.fields[each.spec],
        product: result.fields[each.product],
        date_ymd: date,
      };
    });

    const indateResult = await query
      .insert(tbData, dataRows)
      .onConflict([
        "file_url",
        "date_ymd",
        "spec",
        "product",
        "team",
        "machine",
        "cd_def",
      ])
      .merge()
      .run();

    resBody = {
      E_STATUS: "SC_POC",
      E_MESSAGE: "OCR 결과를 DB에 저장하였습니다",
      E_DATA: {
        fileUrl,
        dataRows,
        indateResult,
        result,
        mappingObject,
        mappingList,
      },
    };
    // }
  } else if (method === "GET") {
    // get 조건에서도 file URL로 데이터를 조회 => 적어도 날짜 차이는 알 수 있음

    let list = [];
    resBody = {
      E_STATUS: "SC_POC",
      E_MESSAGE: "GET OK",
      message: "GET메소드 접근 성공",
      E_DATA: body.date,
    };

    if (body.fileUrl) {
      // /z/0405에서 데이터 조회하는 경우
      const { fileUrl } = body;
      list = await query
        .select()
        .from(tbData)
        .join(tbDef, {
          [[tbDef, "cd_def"].join(".")]: [tbData, "cd_def"].join("."),
        })
        .leftOuterJoin(tbOpr, {
          [[tbOpr, "cd_opr"].join(".")]: [tbDef, "cd_opr"].join("."),
        })
        .where("file_url", fileUrl)
        .run();

      resBody = {
        E_STATUS: "SC_POC",
        E_MESSAGE: "GET OK",
        E_DATA: list,
      };
    } else if (body.date) {
      // /z/1234에서 데이터 조회하는 경우
      const { startDate, endDate } = body.date;

      list = await query
        .select()
        .from(tbData)
        .join(tbDef, {
          [[tbDef, "cd_def"].join(".")]: [tbData, "cd_def"].join("."),
        })
        .leftOuterJoin(tbOpr, {
          [[tbOpr, "cd_opr"].join(".")]: [tbDef, "cd_opr"].join("."),
        })
        .whereBetween("date_ymd", [startDate, endDate])
        .run();

      resBody = {
        E_STATUS: "SC_POC",
        E_MESSAGE: "GET OK",
        E_DATA: list,
      };
    }
  } else if (method === "PUT") {
    const { data } = body;

    // if (body.fileUrl) {
    //   const { fileUrl } = body;
    //   const query = sql("mysql").multi("data_table14");
    //   try {
    //     data.forEach((each) => {
    //       query.add(function () {
    //         this.update({ VALUE: each.VALUE })
    //           .where("FILE_URL", each.FILE_URL)
    //           .where("CD_DEF", each.CD_DEF)
    //           .where("TEAM", each.TEAM)
    //           .where("DATE_YMD", each.DATE_YMD)
    //           .where("MACHINE", each.MACHINE)
    //           .where("PRODUCT", each.PRODUCT)
    //           .where("SPEC", each.SPEC);
    //       });
    //     });

    //     const result = await query.run();

    //     if (result.body.code === "S") {
    //       const editedData = await sql()
    //         .select("data_table14")
    //         .where("FILE_URL", fileUrl)
    //         .run();

    //       resBody = {
    //         E_STATUS: "S",
    //         E_MESSAGE: "Success updated DB",
    //         E_DATA: editedData,
    //       };
    //     } else if (result.body.code === "F") {
    //       resBody = {
    //         E_STATUS: "F",
    //         E_MESSAGE: "Failed updated DB",
    //         E_DATA: [],
    //       };
    //     }
    //   } catch (err) {
    //     resBody = {
    //       E_STATUS: "F",
    //       E_MESSAGE: "PUT FAILED",
    //       E_DATA: { err },
    //       errorMessage: "Error Occured",
    //     };
    //   }
    // } else if (!body.fileUrl) {
    const query = sql("mysql").multi(tbData);

    // try {
    data.forEach((each) => {
      query.add(function () {
        this.update({ value: parseInt(each.value) })
          .where("file_url", each.file_url)
          .where("cd_def", each.cd_def)
          .where("team", each.team)
          .where("date_ymd", each.date_ymd)
          .where("machine", each.machine)
          .where("product", each.product)
          .where("spec", each.spec);
      });
    });

    const result = await query.run();

    if (result.body.code === "S") {
      const fileURLs = data.reduce((acc, cur) => {
        if (!acc.includes(cur.file_url)) {
          acc.push(cur.file_url);
        }
        return acc;
      }, []);

      const editedData = await sql()
        .select(tbData)
        .join(tbDef, {
          [[tbDef, "cd_def"].join(".")]: [tbData, "cd_def"].join("."),
        })
        .leftOuterJoin(tbOpr, {
          [[tbOpr, "cd_opr"].join(".")]: [tbDef, "cd_opr"].join("."),
        })
        .whereIn("file_url", fileURLs)
        .run();

      // let list = [];
      // list = await query
      //   .select()
      //   .from(tbData)
      //   .join(tbDef, {
      //     [[tbDef, "cd_def"].join(".")]: [tbData, "cd_def"].join("."),
      //   })
      //   .leftOuterJoin(tbOpr, {
      //     [[tbOpr, "cd_opr"].join(".")]: [tbDef, "cd_opr"].join("."),
      //   })
      //   .where("file_url", fileUrl)
      //   .run();

      resBody = {
        E_STATUS: "S",
        E_MESSAGE: "Success updated DB",
        E_DATA: editedData,
      };
      // resBody = {
      //   E_STATUS: "S",
      //   E_MESSAGE: "Success updated DB",
      //   E_DATA: list,
      //   E_reqDATA: data,
      // };
    } else if (result.body.code === "F") {
      resBody = {
        E_STATUS: "F",
        E_MESSAGE: "Failed updated DB",
        E_DATA: [],
      };
    }
    // } catch (err) {
    //   resBody = {
    //     E_STATUS: "F",
    //     E_MESSAGE: "PUT FAILED",
    //     E_DATA: { err },
    //     errorMessage: "Error Occured",
    //   };
    // }
    // }
  }
  draft.response.body = resBody;
};
