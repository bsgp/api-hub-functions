module.exports = async (draft, { request, lib, rfc, file, task }) => {
  if (draft.response.body.errorMessage) {
    return;
  }

  const {
    ifId,
    table,
    rfcFunctionName,
    rfcParamsGenerator,
    rfcFieldsGetterForUpdate,
  } = draft.pipe.json;

  const ifTable = "TBSAP000";

  const { tryit, type, merge, adjustTime, isNumber } = lib;
  const { isArray } = type;

  function isValidList(arrList) {
    if (isArray(arrList)) {
      if (arrList.length > 0) {
        return true;
      }
    }
    return false;
  }

  const { builder } = draft.pipe.ref;
  const { knex } = builder;
  let thisTaskId = request.taskID;
  const thisTaskGroupId = request.taskGroupID;

  // // TODO: TASK로 실행될때 RunTimeId를 자동으로 생성되게 해야 함.
  // const runTimeId = tryit(() => request.body.RunTimeId);
  // if (!runTimeId) {
  //   draft.response.body = {
  //     InterfaceId: ifId,
  //     DbTable: table,
  //     E_STATUS: "F",
  //     E_MESSAGE: [
  //       "RunTimeId가 없습니다.",
  //       `RunTimeId는 임의string값으로 동시에 중복 실행되는것을 방지합니다`,
  //     ].join(" "),
  //   };
  //   return;
  // }

  let runTimeData = await getRemoteRunTimeData(ifId, {
    tryit,
    file,
    request,
    isNumber,
  });

  const hasRunTimeData = Object.keys(runTimeData.response).length > 0;
  if (!hasRunTimeData) {
    await file.upload(`if/running/${ifId}.json`, runTimeData, {
      gzip: true,
    });
  }

  if (request.method === "POST" && hasRunTimeData) {
    draft.response.body = runTimeData;
    draft.pipe.json.terminateFlow = true;
    return;
  }

  if (request.method === "TASK" && thisTaskId) {
    if (!runTimeData.response[thisTaskId]) {
      runTimeData.response[thisTaskId] = {
        id: thisTaskId,
        groupt: thisTaskGroupId,
      };
    }
  }

  const count = tryit(() => parseInt(request.body.Limit, 10)) || 1000;
  let ifkeyList;
  const hasInvalidCount = Number.isNaN(count) || count === 0;

  draft.response.body = {};

  if (hasInvalidCount) {
    // pass
  } else {
    const timeStart = new Date();
    const query = builder.select({ a: ifTable }, undefined, {
      fetchDefaultValue: true,
      debug: true,
    });
    query.join({ b: table }, "b.IFKEY", "a.IFKEY");
    query.whereNull("a.SEND_DT");
    query.distinct("a.IFKEY");
    query.limit(count);
    const aSel000 = await query.run();
    const timeEnd = new Date();
    aSel000.duration = timeEnd - timeStart;
    draft.response.body = aSel000;

    ifkeyList = tryit(() => aSel000.body.list);
  }

  if (isValidList(ifkeyList)) {
    if (request.method === "TASK") {
      // Limit concurrency
      let reachedLimit = false;
      const maxConcurrency = 10;
      if (Object.keys(runTimeData.response).length >= maxConcurrency) {
        draft.response.body = {
          InterfaceId: ifId,
          DbTable: table,
          E_STATUS: "F",
          E_MESSAGE: [
            `병렬처리 가능한 최대 세션수는 ${maxConcurrency}입니다`,
          ].join(" "),
          result: "",
        };
        reachedLimit = true;
        // runTimeData.response.reached_max_concurrency = draft.response.body;
        await file.upload(
          `if/running/${ifId}/reached_max_concurrency`,
          draft.response.body,
          {
            gzip: true,
          }
        );
      }

      if (reachedLimit === false) {
        // TODO: update SEND_DT for each selected row
        const updateData = {};
        updateData.SEND_DT = knex.raw(`SYSDATE`);

        const updateQuery = builder.update(ifTable, updateData).whereIn(
          "IFKEY",
          ifkeyList.map(({ IFKEY }) => IFKEY)
        );
        const updateResult = await updateQuery.run();
        if (
          tryit(
            () => updateResult.statusCode === 200 && updateResult.body.count > 0
          ) !== true
        ) {
          draft.response.body = {
            InterfaceId: ifId,
            DbTable: table,
            E_STATUS: "F",
            E_MESSAGE: ["SEND_DT update 실패"].join(" "),
            IFKEY_LIST: ifkeyList,
            result: "",
          };
          // runTimeData.response.failed_to_create_next_task
          // = draft.response.body;
          await file.upload(
            `if/running/${ifId}/failed_to_create_next_task`,
            draft.response.body,
            {
              gzip: true,
            }
          );
        } else {
          // TODO: addTask(); it should be done after update SEND_DT above
          const taskResult = await task.create(
            [ifId.toLowerCase(), request.stage].join("_"),
            request.flow,
            request.qualifier,
            request.body
          );

          // runTimeData.response[taskResult.id] = taskResult;
          taskResult.count = ifkeyList.length;
          await file.upload(`if/running/${ifId}/${taskResult.id}`, taskResult, {
            gzip: true,
          });
        }
      }
    } else if (request.method === "POST") {
      // TODO: addTask();
      const taskResult = await task.create(
        [ifId.toLowerCase(), request.stage].join("_"),
        request.flow,
        request.qualifier,
        request.body
      );
      // runTimeData.count += ifkeyList.length;
      // await file.upload(
      //   `if/running/${ifId}.json`,
      //   { ...runTimeData, response: {} },
      //   {
      //     gzip: true,
      //   }
      // );
      // runTimeData.response[taskResult.id] = taskResult;
      taskResult.count = ifkeyList.length;
      await file.upload(`if/running/${ifId}/${taskResult.id}`, taskResult, {
        gzip: true,
      });

      thisTaskId = taskResult.id;
    }
    runTimeData = await moveIfAllDone(runTimeData, {
      file,
      adjustTime,
      ifId,
      merge,
      tryit,
      request,
      isNumber,
    });

    if (request.method === "POST") {
      draft.response.body = runTimeData;
      draft.pipe.json.terminateFlow = true;
      return;
    }
  } else {
    if (hasInvalidCount) {
      draft.response.body = {
        InterfaceId: ifId,
        DbTable: table,
        E_STATUS: "F",
        E_MESSAGE: [
          "Limit가 없어서 선행된 IFKEY Query가 실행되지 않습니다",
        ].join(" "),
      };
    } else {
      draft.response.body = {
        InterfaceId: ifId,
        DbTable: table,
        E_STATUS: "F",
        E_MESSAGE: [
          `Limit = ${count};`,
          "선행된 IFKEY Query결과가 유효하지 않습니다",
        ].join(" "),
      };
    }

    if (runTimeData.response[thisTaskId] === undefined) {
      runTimeData.response[thisTaskId] = {
        id: thisTaskId,
        groupt: thisTaskGroupId,
      };
    }
    runTimeData.response[thisTaskId].result = draft.response.body;
    await file.upload(
      `if/running/${ifId}/${thisTaskId}`,
      runTimeData.response[thisTaskId],
      {
        gzip: true,
      }
    );
    runTimeData = await moveIfAllDone(runTimeData, {
      file,
      adjustTime,
      ifId,
      merge,
      tryit,
      request,
      isNumber,
    });
    return;
  }

  // runTimeData.count += ifkeyList.length;
  // await file.upload(
  //   `if/running/${ifId}.json`,
  //   { ...runTimeData, response: {} },
  //   {
  //     gzip: true,
  //   }
  // );

  const query = builder.select({ a: ifTable }, undefined, {
    fetchDefaultValue: true,
    debug: true,
  });
  query.join({ b: table }, "b.IFKEY", "a.IFKEY");
  // query.whereNull("a.SEND_DT");
  query.orderBy(["b.IFKEY", "b.IFSEQ"]);

  // if (isValidList(ifkeyList)) {
  query.whereIn(
    "a.IFKEY",
    ifkeyList.map(({ IFKEY }) => IFKEY)
  );
  // }

  let list000;
  if (!hasInvalidCount && !isValidList(ifkeyList)) {
    // pass
  } else {
    const timeStart = new Date();
    const selResult = await query.run();
    const timeEnd = new Date();
    selResult.duration = timeEnd - timeStart;
    draft.response.body = selResult;

    list000 = tryit(() => selResult.body.list);
  }

  if (isValidList(list000)) {
    // pass
  } else {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table,
      E_STATUS: "F",
      E_MESSAGE: [
        "전송할 데이터가 없습니다.",
        `${ifTable}.SEND_DT가 null값인것만 전송대상입니다.`,
        `JOIN ${table}.IFKEY = ${ifTable}.IFKEY`,
      ].join(" "),
    };
    runTimeData.response[thisTaskId].result = draft.response.body;
    await file.upload(
      `if/running/${ifId}/${thisTaskId}`,
      runTimeData.response[thisTaskId],
      {
        gzip: true,
      }
    );
    runTimeData = await moveIfAllDone(runTimeData, {
      file,
      adjustTime,
      ifId,
      merge,
      tryit,
      request,
      isNumber,
    });
    return;
  }
  // } else if (list000 === undefined) {
  //   draft.response.body = selResult;
  //   draft.response.statusCode = 500;
  //   return;
  // }

  const rfcConnection = draft.pipe.json.connection;

  const newObject000 = {};
  const length000 = list000.length;
  for (let index000 = 0; index000 < length000; index000 += 1) {
    const each = list000[index000];
    if (newObject000[each.IFKEY] === undefined) {
      newObject000[each.IFKEY] = { header: { ...each }, items: [] };
    }
    newObject000[each.IFKEY].items.push({ ...each });
  }

  const tStart = new Date();
  const newList000 = Object.keys(newObject000).map((key) => newObject000[key]);
  const results = [];
  const newLength000 = newList000.length;
  for (let newIndex000 = 0; newIndex000 < newLength000; newIndex000 += 1) {
    const timeStart = new Date();
    const each = newList000[newIndex000];
    const getRfcParameters = new Function("each", rfcParamsGenerator);
    const rfcResult = await rfc.invoke(
      rfcFunctionName,
      getRfcParameters(each),
      rfcConnection,
      { version: "750" }
    );
    if (rfcResult.statusCode === 200) {
      const eStatus = rfcResult.body.result.E_STATUS;
      const eMessage = rfcResult.body.result.E_MESSAGE;
      const updateData = { E_STATUS: eStatus, E_MESSAGE: eMessage };
      updateData.SEND_DT = knex.raw(`SYSDATE`);

      const updateQuery = builder
        .update(ifTable, updateData)
        .where("IFKEY", each.header.IFKEY);
      const updateResult = await updateQuery.run();
      rfcResult.updateResult = updateResult;

      if (rfcFieldsGetterForUpdate) {
        const getRfcFieldsForUpdate = new Function(
          "result",
          rfcFieldsGetterForUpdate
        );
        const updateData2 = getRfcFieldsForUpdate(rfcResult.body.result);
        const updateQuery2 = builder
          .update(table, updateData2)
          .where("IFKEY", each.header.IFKEY);
        const updateResult2 = await updateQuery2.run();
        rfcResult.updateResult2 = updateResult2;
      }
    }
    rfcResult.data = each;
    const timeEnd = new Date();
    rfcResult.duration = timeEnd - timeStart;
    results.push(rfcResult);
  }

  const tEnd = new Date();

  draft.response.body = {
    duration: tEnd - tStart,
    E_STATUS: "S",
    E_MESSAGE: `${results.length}건을 처리하였습니다`,
    results,
  };

  if (request.method === "TASK") {
    runTimeData.response[thisTaskId].result = draft.response.body;
    runTimeData.response[thisTaskId].count = ifkeyList.length;
    await file.upload(
      `if/running/${ifId}/${thisTaskId}`,
      runTimeData.response[thisTaskId],
      {
        gzip: true,
      }
    );
    runTimeData = await moveIfAllDone(runTimeData, {
      file,
      adjustTime,
      ifId,
      merge,
      tryit,
      request,
      isNumber,
    });
    if (runTimeData.allHasResult === true) {
      await task.create(
        [ifId.toLowerCase(), request.stage].join("_"),
        request.flow,
        request.qualifier,
        request.body
      );
    }
  }

  // if (result.body.code === "S") {
  //   draft.response.body = {
  //     InterfaceId: request.body.InterfaceId,
  //     DbTable: table,
  //     E_STATUS: "S",
  //     E_MESSAGE: "성공하였습니다",
  //   };
  // } else {
  //   draft.response.body = {
  //     InterfaceId: request.body.InterfaceId,
  //     DbTable: table,
  //     E_STATUS: "F",
  //     E_MESSAGE: "실패하였습니다",
  //   };
  // }

  //   const entries = dataList.map((each) => {
  //     return {
  //       company: each.BUKRS,
  //       costct: each.KOSTL,
  //       effdt: each.DATAB,
  //       costct_nm: each.KTEXT,
  //     };
  //   });

  //   const query = builder.insert(table, entries);
  //   const result = await query.run();
  //   draft.response = result;

  //   const selQuery = builder.select(table);
  //   const selResult = await selQuery.run();
  // draft.response = selResult;
};

async function moveIfAllDone(runTimeData, options = {}) {
  const { file, adjustTime, ifId, merge, tryit, request, isNumber } = options;
  const remoteRunTimeData = await getRemoteRunTimeData(ifId, {
    tryit,
    file,
    request,
    isNumber,
  });

  const latestRunTimeData = merge(runTimeData, remoteRunTimeData);
  await file.upload(`if/running/${ifId}.json`, latestRunTimeData, {
    gzip: true,
  });

  const allHasResult = Object.keys(latestRunTimeData.response).reduce(
    (acc, key) => {
      if (latestRunTimeData.response[key].result === undefined) {
        return false;
      }
      return acc;
    },
    true
  );
  latestRunTimeData.allHasResult = allHasResult;
  if (allHasResult === true) {
    const finishTime = adjustTime(new Date(), {
      ignoreMilliseconds: true,
    }).join("/");
    await file.move(
      `if/running/${ifId}.json`,
      `if/done/${ifId}/${finishTime}.json`
    );
    const fileList = await file.list(`if/running/${ifId}/`);
    for (var idx = 0; fileList.length > idx; idx += 1) {
      const path = fileList[idx];
      const resKey = path.replace(`if/running/${ifId}/`, "");
      await file.move(path, `if/done/${ifId}/${finishTime}/${resKey}`);
    }
  }

  return latestRunTimeData;
}

async function getRemoteRunTimeData(key, options = {}) {
  const { tryit, file, request, isNumber } = options;

  let runTimeData = await tryit(() =>
    file.get(`if/running/${key}.json`, {
      gziped: true,
      toJSON: true,
      ignoreEfs: true,
    })
  );
  // let hasRunTimeData = true;

  if (!runTimeData) {
    // hasRunTimeData = false;
    runTimeData = { started: new Date(), request, response: {}, count: 0 };
  } else {
    const fileList = await file.list(`if/running/${key}/`);
    runTimeData.count = 0;
    for (var idx = 0; fileList.length > idx; idx += 1) {
      const path = fileList[idx];
      const resKey = path.replace(`if/running/${key}/`, "");
      runTimeData.response[resKey] = await file.get(path, {
        gziped: true,
        toJSON: true,
        ignoreEfs: true,
      });
      if (isNumber(runTimeData.response[resKey].count)) {
        runTimeData.count += runTimeData.response[resKey].count;
      }
    }
  }
  return runTimeData;
}
