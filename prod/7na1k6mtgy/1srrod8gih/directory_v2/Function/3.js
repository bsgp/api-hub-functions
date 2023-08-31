module.exports = async (draft, context) => {
  const { request, createSorter, fn, isArray } = context;
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

  const { object: object1, values } = request.body; //Keys: keys
  const keyField = fn.getKeyField(object1);

  if (object1 === "user") {
    if (request.body.signInByEmail || request.body.registerAppToken) {
      // pass
    } else {
      const result = await fn.verifyJwt(request, tableName, context);
      if (result.authenticated === false) {
        draft.response.body = result;
        draft.json.terminateFlow = true;
        return;
      }
    }
  }

  if (object1 === "partner") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createPartner(
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
          const result = await fn.updatePartner(
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
        const { addRoles } = request.body;

        try {
          if (addRoles) {
            const result = await fn.addRolesToPartner(
              tableName,
              object1,
              keyField,
              addRoles,
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
          // queryByCategory,
          // queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryPartnerById(
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
            const result = await fn.queryAllPartners(
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
  } else if (object1 === "system") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createSystem(
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
          const result = await fn.updateSystem(
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
      case "GET": {
        const {
          queryById,
          queryByPartnerId,
          // queryByCategory,
          // queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.querySystemById(
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
          } else if (queryByPartnerId) {
            const result = await fn.querySystemsByPartnerId(
              tableName,
              object1,
              keyField,
              queryByPartnerId,
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
      case "PUT": {
        const { addVersions, addRoles } = request.body;

        try {
          if (addVersions) {
            await fn.addVersionsToSystem(
              tableName,
              object1,
              keyField,
              addVersions,
              context
            );

            const result = await fn.querySystemById(
              tableName,
              object1,
              keyField,
              {
                pid: addVersions.pid,
                sid: addVersions.sid,
              },
              context
            );

            draft.response.body = {
              result: fn.convertItemOut(result, keyField),
            };
          } else if (addRoles) {
            const result = await fn.addRolesToSystem(
              tableName,
              object1,
              keyField,
              addRoles,
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
      default: {
        break;
      }
    }
  } else if (object1 === "group") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createGroup(
            tableName,
            object1,
            keyField,
            values,
            context,
            request.body.to,
            request.body.root
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
        const { updateUser } = request.body;

        try {
          if (updateUser) {
            const result = await fn.updateUserInGroup(
              tableName,
              object1,
              keyField,
              updateUser,
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result, ""),
            };
          } else {
            const result = await fn.updateGroup(
              tableName,
              object1,
              keyField,
              values,
              context
            );
            draft.response.body = {
              result: fn.convertItemOut(result, keyField),
            };
          }
        } catch (ex) {
          draft.response.body = {
            errorMessage: ex.message,
          };
        }

        break;
      }
      case "GET": {
        const {
          queryById,
          queryByIds,
          queryByPartnerId,
          // queryByCategory,
          // queryBySearch,
        } = request.body;

        try {
          if (queryById) {
            const result = await fn.queryGroupById(
              tableName,
              object1,
              keyField,
              queryById,
              context
            );

            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryByIds) {
            if (!isArray(queryByIds.gid)) {
              throw new Error(`'gid' must be Array type`);
            }

            const groupIdSet = new Set(queryByIds.gid);
            const promises = Array.from(groupIdSet)
              .filter(Boolean)
              .map(async (groupId) => {
                const result = await fn.queryGroupById(
                  tableName,
                  object1,
                  keyField,
                  { ...queryByIds, gid: groupId },
                  context
                );
                const resultOut = result.map((each) =>
                  fn.convertItemOut(each, keyField)
                );
                return resultOut;
              });

            const finalResults = await Promise.all(promises);

            draft.response.body = {
              count: finalResults.length,
              list: finalResults.flat(),
            };
          } else if (queryByPartnerId) {
            const result = await fn.queryGroupsByPartnerId(
              tableName,
              object1,
              keyField,
              queryByPartnerId,
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
      case "PUT": {
        const { addUsers, relocate, addRoles } = request.body;

        try {
          if (addUsers) {
            const result = await fn.addUsersToGroup(
              tableName,
              object1,
              keyField,
              addUsers,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (relocate) {
            const result = await fn.relocateItem(
              relocate.values,
              relocate.to,
              relocate.root,
              {
                tableName,
                object: object1,
                keyField,
                context,
              }
            );
            const resultOut = fn.convertItemOut(result, keyField);

            const groupData = await fn.queryGroupById(
              tableName,
              object1,
              keyField,
              {
                // pid: resultOut.pid,
                sid: resultOut.sid,
                gid: relocate.root,
                IncludeLowerLevels: true,
                // IncludeHigherLevels: true,
                // IncludeUsers: true,
              },
              context
            );

            draft.response.body = {
              count: groupData.length,
              list: groupData.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (addRoles) {
            const result = await fn.addRolesToGroup(
              tableName,
              object1,
              keyField,
              addRoles,
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
      default: {
        break;
      }
    }
  } else if (object1 === "version") {
    switch (request.method) {
      case "POST": {
        try {
          const result = await fn.createVersion(
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
          const result = await fn.updateVersion(
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
        const { addToSystems } = request.body;

        try {
          if (addToSystems) {
            await fn.addVersionsToSystem(
              tableName,
              object1,
              keyField,
              addToSystems,
              context
            );

            const result = await fn.queryVersionById(
              tableName,
              object1,
              keyField,
              {
                pid: addToSystems.pid,
                vid: addToSystems.vid,
              },
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
        const { queryById, queryByPartnerId, queryBySystemId, validOne } =
          request.body;

        try {
          if (queryById) {
            const result = await fn.queryVersionById(
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
          } else if (queryByPartnerId) {
            const result = await fn.queryVersionsByPartnerId(
              tableName,
              object1,
              keyField,
              queryByPartnerId,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (queryBySystemId) {
            const result = await fn.queryVersionsBySystemId(
              tableName,
              object1,
              keyField,
              queryBySystemId,
              context
            );
            draft.response.body = {
              count: result.length,
              list: result.map((each) => fn.convertItemOut(each, keyField)),
            };
          } else if (validOne) {
            const result = await fn.getCurrentVersion(
              tableName,
              object1,
              keyField,
              validOne,
              context
            );
            if (result.groups) {
              result.groups.sort(createSorter(["name"], "asc"));
            }
            draft.response.body = {
              result,
            };
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
      default: {
        break;
      }
    }
  } else {
    // draft.json.nextNodeKey = "Function#4";
  }
};
