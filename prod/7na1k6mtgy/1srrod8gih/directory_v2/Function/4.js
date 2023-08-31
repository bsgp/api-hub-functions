module.exports = async (draft, context) => {
  const { request, createSorter, fn, isArray, isTruthy } = context;

  const loginUserIds = [
    "gnseo",
    "hsshin",
    "nhan",
    "nhan@fidelitysolution.co.kr",
  ];
  const loginEmails = [
    "gnseo@bsgglobal.com",
    "hsshin@bsgglobal.com",
    "nhan@fidelitysolution.co.kr",
  ];

  if (isTruthy(draft.response.body)) {
    // draft.json.terminateFlow = true;
    // draft.json.nextNodeKey = "";
    return;
  }

  const thisStage = request.stage === "staging" ? "dev" : request.stage;
  const tableName = ["dir_v2", thisStage].join("_");
  // const [, , object1, object2] = request.path.split("/");

  // try {
  // fn.checkRequired(request, ["systemId"]);
  fn.checkRequired(request.body, ["object"]);
  // } catch (ex) {
  //   draft.response.body = {
  //     errorMessage: ex.message,
  //   };
  //   return;
  // }

  const { object: object1, values, to, from, root } = request.body; //Keys: keys
  const keyField = fn.getKeyField(object1);

  if (object1 === "user") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createUser(
            tableName,
            object1,
            keyField,
            values,
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PATCH": {
        try {
          const result = await fn.updateUser(
            tableName,
            object1,
            keyField,
            values,
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorDescription: ex.stack,
            errorMessage: ex.message,
          };
        }

        break;
      }
      case "GET": {
        const {
          queryById,
          queryByIds,
          queryBySystemId,
          querySiblings,
          queryLowerLevels,
          getSession,
          queryMenus,
          // queryByCategory,
          queryBySearch,
          queryAppTokens,
          queryNotifications,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryUserById(
              tableName,
              object1,
              keyField,
              { ...queryById, includePrimary: true },
              context
            );
            if (result) {
              draft.response.body = {
                count: 1,
                list: [fn.convertItemOut(result, keyField)],
              };
            } else {
              draft.response.body = { count: 0, list: [] };
            }
          } else if (queryByIds) {
            console.log("queryByIds.uid:", queryByIds.uid);
            if (!isArray(queryByIds.uid)) {
              throw new Error(`'uid' must be Array type`);
            }

            const userIdSet = new Set(queryByIds.uid);
            console.log("userIdSet:", userIdSet, userIdSet.length);
            const promises = Array.from(userIdSet)
              .filter(Boolean)
              .map(async (userId) => {
                const result = await fn.queryUserById(
                  tableName,
                  object1,
                  keyField,
                  { ...queryByIds, uid: userId },
                  context
                );
                const resultOut = fn.convertItemOut(result, keyField);
                return resultOut;
              });

            const finalResults = await Promise.all(promises);
            console.log(
              "finalResults:",
              finalResults,
              JSON.stringify(finalResults)
            );
            draft.response.body = {
              count: finalResults.length,
              list: finalResults,
            };
          } else if (queryBySystemId) {
            const result = await fn.queryUsersBySystemId(
              tableName,
              object1,
              keyField,
              queryBySystemId,
              context
            );
            const outResult = result.map((each) =>
              fn.convertItemOut(each, keyField)
            );
            const groupsSet = await outResult.reduce(async (acc, each) => {
              acc = await acc;

              const result = await fn.queryRelationsByUser(
                tableName,
                {
                  sid: each.sid,
                  uid: each.uid,
                },
                context
              );

              each.groupIds = [];

              result.forEach((rel) => {
                acc.add(rel.gid);
                each.groupIds.push(rel.gid);
              });

              // if (each.groups) {
              //   each.groups.forEach((gid) => {
              //     acc.add(gid);
              //   });
              // }
              return acc;
            }, Promise.resolve(new Set()));

            const promises = Array.from(groupsSet).map((gid) => {
              return fn.queryGroupById(
                tableName,
                "group",
                "gid",
                { sid: queryBySystemId.sid, gid },
                context
              );
            });

            const groupsArray = await Promise.all(promises);

            draft.response.body = {
              count: result.length,
              list: outResult,
              groups: groupsArray
                .flat()
                // .map((each) => fn.convertItemOut(each, "gid"))
                // .map(fn.removeSysFields)
                .reduce((acc, each) => {
                  acc[each.gid] = each;
                  return acc;
                }, {}),
            };
          } else if (querySiblings) {
            const result = await fn.queryUserSiblings(
              tableName,
              object1,
              keyField,
              querySiblings,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryAppTokens) {
            const result = await fn.queryAppTokensByUser(
              tableName,
              queryAppTokens,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryNotifications) {
            const result = await fn.queryNotificationsByUser(
              tableName,
              {
                uid: request.userId,
                sid: request.systemId,
              },
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryBySearch) {
            const result = await fn.queryUsersBySearch(
              tableName,
              object1,
              keyField,
              queryBySearch,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryLowerLevels) {
            const result = await fn.queryUserLowerLevels(
              tableName,
              object1,
              keyField,
              queryLowerLevels,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (getSession) {
            const result = await fn.getSession(tableName, getSession, context);
            draft.response.body = {
              result,
            };
          } else if (queryMenus) {
            const result = await fn.queryRolesAndMenusForUser(
              tableName,
              queryMenus,
              context
            );
            draft.response.body = result.paths
              ? {
                  count: result.paths.length,
                  list: result.paths,
                  roles: result.roles,
                  subPathCollection: result.subPathCollection,
                }
              : { count: 0, list: [] };
          }

          if (draft.response.body.list) {
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
        const {
          addRoles,
          migrate,
          signInByEmail,
          signIn,
          registerAppToken,
          changePrimary,
          deleteAppTokens,
          setReadNotification,
          changePassword,
        } = request.body;

        try {
          if (addRoles) {
            const result = await fn.addRolesToUser(
              tableName,
              object1,
              keyField,
              addRoles,
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result, keyField),
            };
          } else if (migrate) {
            const result = await fn.migrateUsers(
              tableName,
              object1,
              keyField,
              migrate,
              context
            );
            draft.response.body = result;
          } else if (deleteAppTokens) {
            const result = await fn.doDeleteAppTokens(
              tableName,
              deleteAppTokens,
              context
            );
            draft.response.body = result;
          } else if (signInByEmail) {
            if (request.partnerId === "36pc5h4ur0") {
              if (loginEmails.includes(signInByEmail.email)) {
                // pass
              } else {
                throw new Error("시스템 접속이 불가합니다");
              }
            }

            const result = await fn.signInByEmail(
              tableName,
              signInByEmail,
              context
            );
            if (
              Object.hasOwn(result, "headers") &&
              Object.hasOwn(result, "body")
            ) {
              draft.response.headers = result.headers;
              draft.response.body = result.body;
            } else {
              draft.response.body = result;
            }
          } else if (signIn) {
            if (request.partnerId === "36pc5h4ur0") {
              if (loginUserIds.includes(signIn.uid)) {
                // pass
              } else {
                throw new Error("시스템 접속이 불가합니다");
              }
            }

            const result = await fn.signInAsV1(tableName, signIn, context);
            if (
              Object.hasOwn(result, "headers") &&
              Object.hasOwn(result, "body")
            ) {
              draft.response.headers = result.headers;
              draft.response.body = result.body;
            } else {
              draft.response.body = result;
            }
          } else if (registerAppToken) {
            const result = await fn.doRegisterAppToken(
              tableName,
              registerAppToken,
              context
            );
            draft.response.body = result;
          } else if (setReadNotification) {
            const result = await fn.doSetReadNotification(
              tableName,
              setReadNotification,
              context
            );
            draft.response.body = result;
          } else if (changePrimary) {
            const result = await fn.doChangePrimary(
              tableName,
              changePrimary,
              context
            );
            draft.response.body = { result };
          } else if (changePassword) {
            const result = await fn.doChangePassword(
              tableName,
              changePassword,
              context
            );
            draft.response.body = { result };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      default: {
        break;
      }
    }
  } else if (object1 === "role") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createRole(
            tableName,
            object1,
            keyField,
            values,
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PATCH": {
        try {
          const result = await fn.updateRole(
            tableName,
            object1,
            keyField,
            values,
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
          };
        }

        break;
      }
      case "PUT": {
        const { migrate, addMenus, removeMenus } = request.body;

        try {
          if (migrate) {
            const result = await fn.migrateRoles(
              tableName,
              object1,
              keyField,
              migrate,
              context
            );
            draft.response.body = result;
          } else if (addMenus) {
            const result = await fn.addMenusToRole(
              tableName,
              object1,
              keyField,
              addMenus,
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result, keyField),
            };
          } else if (removeMenus) {
            const result = await fn.addMenusToRole(
              tableName,
              object1,
              keyField,
              { ...removeMenus, opposite: true },
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result, keyField),
            };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "GET": {
        const {
          queryById,
          queryAll,
          queryByPartnerId,
          // queryByCategory,
          // queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryRoleById(
              tableName,
              object1,
              keyField,
              queryById,
              context
            );
            draft.response.body = result
              ? {
                  count: 1,
                  list: [fn.convertItemOut(result, keyField)],
                }
              : { count: 0, list: [] };
          } else if (queryAll) {
            const result = await fn.queryAllRoles(
              tableName,
              object1,
              keyField,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryByPartnerId) {
            const partner = await fn.queryPartnerById(
              tableName,
              "partner",
              "pid",
              queryByPartnerId,
              context
            );
            const result = await fn.queryRoleByIdList(
              tableName,
              object1,
              keyField,
              partner.roles || [],
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          }
          draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
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
  } else if (object1 === "menu") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createMenu(
            tableName,
            object1,
            keyField,
            values,
            context,
            to,
            root
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "PATCH": {
        try {
          const result = await fn.updateMenu(
            tableName,
            object1,
            keyField,
            values,
            context
          );
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
          };
        }

        break;
      }
      case "PUT": {
        const { migrate, assign, unassign } = request.body;

        try {
          if (migrate) {
            const result = await fn.migrateMenu(
              tableName,
              object1,
              keyField,
              migrate,
              context
            );
            draft.response.body = result;
          } else if (assign) {
            const result = await fn.assignItem(assign, to, root, {
              tableName,
              object: object1,
              keyField,
              context,
            });
            draft.response.body = { result };
          } else if (unassign) {
            const result = await fn.unassignItem(unassign, from, root, {
              tableName,
              object: object1,
              keyField,
              context,
            });
            draft.response.body = { result };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }

        break;
      }
      case "GET": {
        const {
          queryById,
          queryAll,
          // queryByCategory,
          // queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryMenuById(
              tableName,
              object1,
              keyField,
              queryById,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => {
                const outOne = fn.convertItemOut(each, keyField);
                outOne.parent = outOne.parents
                  ? outOne.parents.find(
                      (mid) => result.findIndex((menu) => menu.mid === mid) >= 0
                    )
                  : undefined;
                return outOne;
              }),
            };
          } else if (queryAll) {
            const result = await fn.queryAllMenus(
              tableName,
              object1,
              keyField,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          }
          draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
          };
        }

        break;
      }
      default: {
        break;
      }
    }
  } else if (object1 === "notification") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.saveNotification(tableName, values, context);
          draft.response.body = {
            result: fn.convertItemOut(result, keyField),
          };
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
            object1,
            keyField: fn.getKeyField(object1),
            errorDescription: ex.stack,
          };
        }
        break;
      }
      case "GET": {
        const { queryByUser } = request.body;

        try {
          if (queryByUser) {
            const result = await fn.queryNotificationsByUser(
              tableName,
              queryByUser,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          }
          draft.response.body.list.sort(createSorter(["updatedAt"], "desc"));
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
          };
        }
        break;
      }
      default: {
        break;
      }
    }
  } else {
    if (isTruthy(draft.response.body)) {
      // pass
    } else {
      draft.response.body = {
        errorMessage: "잘못된 접근입니다",
        stage: request.stage,
        object1,
        path: request.path,
      };
    }
  }

  draft.response.headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...draft.response.headers,
  };
  // draft.json.terminateFlow = true;
};
