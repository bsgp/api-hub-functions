module.exports = async (draft, { request, sql }) => {
  const { body, method } = request;
  const { tableName } = body;

  let resBody = {
    E_STATUS: "",
    E_MSG: "",
    E_BODY: [],
  };

  switch (method) {
    case "GET": {
      const { tableName } = request.body;
      const query = sql("mysql").select(tableName);
      const dataFromTable = await query.run();

      resBody = {
        E_STATUS: "S",
        E_MSG: "GET DATA IS DONE",
        E_BODY: dataFromTable,
      };

      break;
    }
    case "POST": {
      const accValuees = [];
      const fakeData = [
        {
          USER_KEY: "TBC-3217",
          DEFEC_DETAILS: "오염",
          GS3_A: "0",
          GS3_B: "3",
          GS4_A: "1",
          GS4_B: "1",
          TOTAL: "5",
        },
      ];
      const builder = sql("mysql");
      const query = fakeData.reduce((acc, obj) => {
        accValuees.push({ acc, obj });
        return acc.insert(tableName, obj);
      }, builder);

      const result = await query.run();

      if (result) {
        resBody = {
          E_STATUS: "S",
          E_MSG: "SUCCESS",
          E_BODY: result,
          ERR: accValuees,
        };
      } else {
        resBody = {
          E_STATUS: "F",
          E_MSG: "FAILED",
          E_BODY: [],
          ERR: accValuees,
        };
      }
      break;
    }
    case "PATCH": {
      const { updatedData, tableName } = request.body;

      resBody = {
        E_STATUS: "",
        E_MSG: "",
        E_BODY: "",
      };

      // const query = sql("mysql").update(tableName, [...updatedData]);
      const query = sql("mysql").multi(tableName);

      updatedData.forEach((cur) => {
        query.add(function () {
          this.update(cur).where("USER_KEY", cur.USER_KEY);
        });
      });

      const result = await query.run();

      resBody.E_BODY = result;
      break;
    }
  }

  draft.response.body = resBody;
};
