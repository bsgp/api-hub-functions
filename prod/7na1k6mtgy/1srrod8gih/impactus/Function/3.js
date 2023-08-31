module.exports = async (draft, context) => {
  const {
    request,
    createSorter,
    fn,
    flow,
    isArray,
    dayjs,
    isTruthy,
    dynamodb,
  } = context;
  const tableName = ["impactus", request.stage].join("_");
  let { object1, object2 } = request.body;
  const { values } = request.body;

  if (object1 === undefined) {
    [, , object1, object2] = request.path.split("/");
  }

  try {
    fn.checkRequired(request, ["systemId"]);
  } catch (ex) {
    draft.response.body = {
      errorMessage: ex.message,
      errorDescription: ex.stack,
    };
    return;
  }

  if (object1 === "monitoring" && object2 === "unit") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createUnit(tableName, values, context);
          draft.response.body = {
            result: fn.convertItemOut(result),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PATCH": {
        try {
          const result = await fn.updateUnit(tableName, values, context);
          draft.response.body = {
            result: fn.convertItemOut(result),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "GET": {
        const {
          queryById,
          queryAllInCurrentSystem,
          queryByCategory,
          queryAllOfMeByCategory,
          queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryUnitById(
              tableName,
              queryById,
              context
            );
            draft.response.body = result
              ? {
                  count: 1,
                  list: [fn.convertItemOut(result)],
                }
              : { count: 0, list: [] };
          } else if (queryAllInCurrentSystem) {
            const result = await fn.queryAllUnitInCurrentSystem(
              tableName,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each)),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryByCategory) {
            const result = await fn.queryUnitByCategory(
              tableName,
              queryByCategory,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each)),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryAllOfMeByCategory) {
            const result = await fn.queryUnitOfMeByCategory(
              tableName,
              queryAllOfMeByCategory,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each)),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryBySearch) {
            const result = await fn.queryUnitBySearch(
              tableName,
              queryBySearch,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each)),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PUT": {
        const { addUsers } = request.body;

        try {
          if (addUsers) {
            const result = await fn.addUsersToUnit(
              tableName,
              addUsers,
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result),
            };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      default: {
        break;
      }
    }
  } else if (object1 === "monitoring" && object2 === "item") {
    switch (request.method) {
      case "POST": {
        try {
          const items = await fn.queryItemsByUnitId(
            tableName,
            { unitId: values.unitId },
            context
          );
          const lastSeq = items.length;

          const result = await fn.createItem(
            tableName,
            { ...values, seq: lastSeq + 1 },
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PATCH": {
        try {
          const result = await fn.updateItem(tableName, values, context);
          draft.response.body = {
            result: fn.convertItemOut(result),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PUT": {
        const { changeSequence } = request.body;

        try {
          if (changeSequence) {
            const result = await fn.changeItemSequence(
              tableName,
              changeSequence,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map(fn.convertItemOut),
            };
          } else if (values) {
            const result = await fn.copyItems(tableName, values, context);
            draft.response.body = {
              result: fn.convertItemOut(result),
            };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      default:
        break;
    }
  } else if (object1 === "monitoring" && object2 === "record") {
    switch (request.method) {
      case "PUT": {
        try {
          const result = await fn.saveRecord(tableName, values, context, draft);

          const mergedResult = await fn.mergeUnitToRecord(
            result,
            tableName,
            { id: values.unitId },
            context
          );

          // if (mergedResult.convos) {
          //   mergedResult.convos = mergedResult.convos.map((each) => {
          //     return each;
          //   });
          // }

          draft.response.body = {
            result: mergedResult,
          };
          // let unitData = await fn.queryUnitById(
          //   tableName,
          //   { id: values.unitId },
          //   context
          // );
          // unitData = convertItemOut(unitData);

          // draft.response.body.result.items.forEach((item) => {
          //   const unitItem = unitData.items.find((each) =>
          // each.id === item.id);
          //   if (unitItem) {
          //     Object.keys(unitItem).forEach((key) => {
          //       item[key] = unitItem[key];
          //     });
          //   }
          // });
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "DELETE": {
        try {
          const result = await fn.deleteUnreleasedRecord(
            tableName,
            values,
            context,
            draft
          );
          const oldRecord = fn.convertItemOut(result);
          if (oldRecord.id) {
            const unitData = await fn.queryUnitById(
              tableName,
              { id: values.unitId, getInitialValue: true },
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(unitData),
            };
            draft.response.body.result.unitId = draft.response.body.result.id;
            delete draft.response.body.result.id;
          } else {
            throw new Error(
              "Unexpected result during deleting unreleased record"
            );
          }
        } catch (ex) {
          if (ex.code === "ConditionalCheckFailedException") {
            draft.response.body = {
              message: "이미 삭제되었습니다",
            };
          } else {
            draft.response.body = {
              errorMessage: "삭제 실패",
              errorDescription: ex.message,
            };
          }
        }

        break;
      }
      case "GET":
        {
          const { queryById, queryUnreleased, queryAllOfMe, queryAllOfMyOrg } =
            request.body;

          if (queryById) {
            const result = await fn.queryRecordById(
              tableName,
              queryById,
              context
            );
            if (result) {
              const mergedResult = await fn.mergeUnitToRecord(
                result,
                tableName,
                { id: queryById.unitId, coaId: queryById.coaId },
                context
              );

              if (queryById.coaId) {
                if (mergedResult.convos.length > 0) {
                  mergedResult.convos = await Promise.all(
                    mergedResult.convos.map(async (cvs) => {
                      const newCvsList = await fn.mergeCommentsToCoact(
                        [cvs],
                        tableName,
                        context
                      );
                      const newCvs = newCvsList[0];
                      const coactsWithUsers = await fn.mergeUserToCoact(
                        tableName,
                        { list: [newCvs] },
                        context
                      );
                      newCvs.users = coactsWithUsers.users;
                      newCvs.groups = coactsWithUsers.groups;

                      const statsSets = {};
                      const statsOperations = {};
                      const statsValues = {
                        ym: dayjs
                          .tz(cvs.createdAt, "Asia/Seoul")
                          .format("YYYYMM"),
                        sid: request.systemId,
                        uid: cvs.assigneeId,
                        category: cvs.category,
                      };
                      if (
                        cvs.recStatus === "RELE" &&
                        // outcvs.recStatus !== cvs.recStatus &&
                        cvs.assigneeId
                      ) {
                        statsValues.coactsUnread = [cvs.id];
                        statsSets.coactsUnread = "string";
                        statsOperations.coactsUnread = "SUB";
                      }

                      if (isTruthy(statsOperations)) {
                        await dynamodb.updateItem(
                          tableName,
                          fn.convertKeysIn(statsValues, "STATS"),
                          fn.convertValuesIn(statsValues, "STATS"),
                          {
                            ...fn.getDdbOptions(),
                            operations: statsOperations,
                            sets: statsSets,
                          }
                        );
                      }
                      return newCvs;
                    })
                  );
                }
              }

              draft.response.body = {
                count: 1,
                list: [mergedResult],
              };
            } else {
              draft.response.body = { count: 0, list: [] };
            }
          } else if (queryAllOfMe) {
            const result = await fn.queryRecordByUserId(
              tableName,
              { ...queryAllOfMe, uid: request.userId },
              context
            );
            // const resultOut = result.map(fn.convertItemOut);
            const summaryData = await fn.querySummary(
              tableName,
              { category: queryAllOfMe.category },
              context
            );

            draft.response.body = {
              count: result.length,
              list: result,
              summary: summaryData,
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryAllOfMyOrg) {
            const result = await flow.run({
              id: "directory_v2",
              body: {
                object: "user",
                querySiblings: {
                  pid: request.partnerId,
                  sid: request.systemId,
                  uid: request.userId,
                  includeLowerForLeader: true,
                },
              },
            });

            const records = [];
            const outUsers = [];

            if (result.list.length > 0) {
              for (const user of result.list) {
                const outUser = fn.convertItemOut(user);
                outUsers.push(outUser);
                // console.log("user:", user, outUser);
                const result = await fn.queryRecordByUserId(
                  tableName,
                  { ...queryAllOfMyOrg, uid: outUser.uid },
                  context
                );
                const resultOut = result.map(fn.convertItemOut);
                records.push(...resultOut);
              }
            }

            // draft.response.body = {
            //   count: resultOut.length,
            //   list: resultOut,
            // };
            const summaryData = await fn.querySummary(
              tableName,
              { category: queryAllOfMyOrg.category },
              context
            );

            draft.response.body = {
              count: records.length,
              list: records,
              summary: summaryData,
              users: outUsers.reduce((acc, user) => {
                acc[user.uid] = user;
                return acc;
              }, {}),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryUnreleased) {
            try {
              const result = await fn.queryUnreleasedRecord(
                tableName,
                queryUnreleased,
                context
              );
              if (result) {
                const mergedResult = await fn.mergeUnitToRecord(
                  result,
                  tableName,
                  { id: queryUnreleased.unitId },
                  context
                );
                draft.response.body = {
                  count: 1,
                  list: [mergedResult],
                };
              } else {
                draft.response.body = { count: 0, list: [] };
              }
            } catch (ex) {
              draft.response.body = {
                errorMessage: ex.message,
                errorDescription: ex.stack,
              };
            }
          }

          // draft.response.body.list.forEach((eachResult) => {
          //   if (eachResult.convos) {
          //     eachResult.convos = eachResult.convos.map((each) => {
          //       return fn.removeDeletedImage(each);
          //     });
          //   }
          // });
        }
        break;
      default:
        break;
    }
  } else if (object1 === "monitoring" && object2 === "coact") {
    if (request.body.migrate) {
      const result = await fn.migrateCoact(tableName, context);
      draft.response.body = { result };
      return;
    }
    switch (request.method) {
      case "PUT": {
        try {
          const result = await fn.saveCoact(tableName, values, context, draft);

          const wComments = await fn.mergeCommentsToCoact(
            [result],
            tableName,
            context
          );

          draft.response.body = {
            result: wComments[0],
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "GET":
        {
          const {
            queryById,
            queryAllOfMe,
            getUrlForUpload,
            getMultiUrlForUpload,
            queryBySearch,
          } = request.body;

          if (queryById) {
            const result = await fn.queryCoactById(
              tableName,
              queryById,
              context
            );
            if (result) {
              const results = await fn.mergeCommentsToCoact(
                [result],
                tableName,
                context
              );

              draft.response.body = {
                count: 1,
                list: results,
              };
            } else {
              draft.response.body = { count: 0, list: [] };
            }
          } else if (queryAllOfMe) {
            const result = await fn.queryCoactByUserId(
              tableName,
              { ...queryAllOfMe, uid: request.userId, includeComments: true },
              context
            );

            draft.response.body = {
              count: result.list.length,
              ...result,
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (queryBySearch) {
            const result = await fn.queryCoactBySearch(
              tableName,
              queryBySearch,
              context
            );

            const results = await fn.mergeCommentsToCoact(
              result,
              tableName,
              context
            );

            const mergedResults = await fn.mergeItemToCoact(
              tableName,
              { list: results },
              context
            );

            draft.response.body = {
              count: results.length,
              ...mergedResults,
              // users: users.reduce((acc, user) => {
              //   acc[user.uid] = user;
              //   return acc;
              // }, {}),
              // groups: groups.reduce((acc, group) => {
              //   acc[group.gid] = group;
              //   return acc;
              // }, {}),
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else if (getUrlForUpload) {
            const result = await fn.getUploadUrl(getUrlForUpload, context);

            draft.response.body = {
              result,
            };
          } else if (getMultiUrlForUpload) {
            if (!isArray(getMultiUrlForUpload)) {
              throw new Error("getMultiUrlForUpload must be Array type");
            }

            const multiResults = [];
            for (let idx = 0; idx < getMultiUrlForUpload.length; idx += 1) {
              const result = await fn.getUploadUrl(
                getMultiUrlForUpload[idx],
                context
              );
              multiResults.push(result);
            }

            draft.response.body = {
              count: multiResults.length,
              list: multiResults,
            };
          }
        }
        break;
    }
  } else if (object1 === "monitoring" && object2 === "comment") {
    switch (request.method) {
      case "PUT": {
        try {
          const result = await fn.saveComment(
            tableName,
            values,
            context,
            draft
          );

          const resultOut = result.map(fn.convertItemOut);

          const { users, groups } = await fn.mergeUserToCoact(
            tableName,
            { list: [{ comments: resultOut }] },
            context
          );

          draft.response.body = {
            count: resultOut.length,
            list: resultOut,
            users,
            groups,
          };
          draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "GET":
        {
          const { queryByParent } = request.body;

          if (queryByParent) {
            const result = await fn.queryCommentsByParent(
              tableName,
              queryByParent,
              context
            );

            const resultOut = result.map(fn.convertItemOut);

            draft.response.body = {
              count: resultOut.length,
              list: resultOut,
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          }
        }
        break;
    }
  } else if (object1 === "comprehensive" && object2 === "coact") {
    switch (request.method) {
      case "GET":
        {
          const { queryAllFromMe, queryAllToMe } = request.body;

          let result;
          if (queryAllFromMe) {
            // result = await fn.queryCoactByQueryLimit(
            //   tableName,
            //   { ...queryAllFromMe, toMe: false },
            //   context
            // );
            result = await fn.queryCoactByUserId(
              tableName,
              { ...queryAllFromMe, uid: request.userId, category: undefined },
              context
            );
          } else if (queryAllToMe) {
            result = await fn.queryCoactByQueryLimit(
              tableName,
              { ...queryAllToMe, toMe: true },
              context
            );
          }

          if (result) {
            const resultOut = result.list
              ? result.list.map(fn.convertItemOut)
              : result.map(fn.convertItemOut);

            draft.response.body = {
              count: resultOut.length,
              ...(result.list ? result : {}),
              list: resultOut,
            };
            draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
          } else {
            draft.response.body = {
              count: 0,
              list: [],
            };
          }
        }
        break;
    }
  } else {
    draft.response.body = {
      errorMessage: "잘못된 접근입니다",
      stage: request.stage,
      object1,
      object2,
      path: request.path,
    };
  }

  draft.response.headers = {
    "Content-Type": "application/json; charset=utf-8",
  };
  draft.json.terminateFlow = true;
};
