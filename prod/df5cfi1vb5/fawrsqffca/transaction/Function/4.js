const uuid = require("uuid");

module.exports = async (draft, { request, user, util, sql }) => {
  const { method, table } = draft.pipe.json;
  if (method !== "POST") {
    return;
  }
  // 	draft.response.body = columns;
  // 	return;
  const { type, tryit } = util;
  const { data } = request.body;

  let errorMessage = "";

  if (!type.isArray(data)) {
    errorMessage = "data is not Array";
  }

  if (data.length === 0) {
    errorMessage = "data is empty";
  }

  const builder = sql("mysql");

  if (!errorMessage) {
    const validator = await builder.validator(table);
    data.every((item) => {
      const result = validator(item, {
        ignore: "UUID",
        rules: {
          BUDAT: "EXACT",
        },
      });
      errorMessage = result.errorMessage;
      return result.isValid;
    });
  }

  if (errorMessage) {
    draft.response.body = { errorMessage };
    draft.response.statusCode = 400;
    return;
  }

  const list = data.map((item) => {
    const newItem = {
      ...item,
    };
    Object.keys(newItem).forEach((key) => {
      if (!["NOTE"].includes(key) && util.type.isString(newItem[key])) {
        newItem[key] = newItem[key].toUpperCase();
      }
    });
    if (type.isFalsy(item.UUID)) {
      newItem.UUID = uuid.v4();
    }
    newItem.MJAHR = item.BUDAT.substring(0, 4);
    newItem.MONAT = item.BUDAT.substring(4, 6);
    newItem.CREATED_BY = user.key;
    return newItem;
  });

  // 	const listB = list.filter(each => each.BEEND === "B");

  // 	if(listB.length > 0){
  // 	    const queryB = builder.multi(table);
  //     	listB.forEach(each=>{
  // 	        queryB.add(function(){
  //     	        this.select().where("LOTNO", each.LOTNO)
  // .where("ROUTG", each.ROUTG,).where("BEEND", "B",).where(function(){
  //     	            this.whereNull("RLUID").orWhere("RLUID","")
  //     	        });
  //     	    })
  // 	    })
  //         const resultB = await queryB.run();
  //         const bNotExists = resultB.body.list.reduce((acc, each)=>{
  //             if(acc ===false){
  //                 return acc;
  //             }

  //             if(each.result.length > 0){
  //                 draft.response.body = {
  //                     code: "F",
  //                     results: [{
  //                         errorMessage:
  // `${each.result[0].LOTNO}로 이미 입고(작업시작)하였습니다`
  //                     }]
  //                 };
  //                 return false;
  //             }
  //             return acc;
  //         }, true);

  //         if(bNotExists === false){
  //             draft.response.statusCode = 500;
  //             return;
  //         }
  //         // draft.response = resultB;
  // 	}

  const query = builder.multi(table, { force: true });
  list.forEach((each) => {
    query.add(function () {
      this.insert(each);
    });
  });
  const result = await query.run();

  switch (result.body.code) {
    case "S": {
      draft.response.body = {
        code: result.body.code,
        results: [],
      };

      draft.pipe.json.sListE = list.filter((each) => each.BEEND === "E");
      break;
    }
    case "F": {
      draft.response.body = {
        code: result.body.code,
        results: result.body.list.map((eachError) => ({
          // code,
          // errorCode: code === "F" ? data.code : undefined,
          eachError,
          errorMessage:
            tryit(() => eachError.result.message) ||
            "이미 존재하는 Lot 번호입니다.",
        })),
      };
      break;
    }
    case "P": {
      draft.response.body = {
        code: result.body.code,
        results: result.body.list.map(({ code, index, result }) => ({
          code,
          errorCode: code === "F" ? result.code : undefined,
          data: code === "F" ? list[index] : undefined,
        })),
      };
      draft.pipe.json.sListE = result.body.list
        .filter(({ code }) => code === "S")
        .map(({ index }) => list[index])
        .filter((each) => each.BEEND === "E");
      break;
    }
    default: {
      draft.response.body = "code in body is not valid";
      draft.response.statusCode = "500";
      break;
    }
  }
};
