function getDdbOptions() {
  // if (request.partnerId === "36pc5h4ur0") {
  //   return { useCustomerRole: true, useExactTableName: true };
  // } else {
  return { useCustomerRole: false };
  // }
}
module.exports.getDdbOptions = getDdbOptions;

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
// pass
function removeUndefinedKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
module.exports.removeUndefinedKeys = removeUndefinedKeys;

function checkRequired(data = {}, attributes = []) {
  attributes.forEach((each) => {
    if ([undefined, null, ""].includes(data[each])) {
      throw new Error(`${each} is required`);
    }
  });
  return true;
}
module.exports.checkRequired = checkRequired;

function deleteBackendAttributesForQuery(data, keys = {}) {
  const newData = { ...data };
  [
    "ttlts",
    "lowerName",
    "pkid",
    "skid",
    "pk2",
    "sk2",
    // "parents", // client에서 hierarchy구조로 보여질려면 필요함.
    "grand_parents",
    "grand_children",
    "children",
  ]
    .concat(Object.keys(keys))
    .forEach((key) => {
      delete newData[key];
    });
  return newData;
}
module.exports.deleteBackendAttributesForQuery =
  deleteBackendAttributesForQuery;

function deleteBackendAttributesForUpdate(data, keys = {}) {
  const newData = { ...data };
  [
    "ttlts",
    "lowerName",
    "pkid",
    "skid",
    "pk2",
    "sk2",
    "parent",
    "grand_parents",
    "grand_children",
    "children",
  ]
    .concat(Object.keys(keys))
    .forEach((key) => {
      delete newData[key];
    });
  return newData;
}
module.exports.deleteBackendAttributesForUpdate =
  deleteBackendAttributesForUpdate;

// module.exports.pkidOut = pkidOut;function pkidOut(pkid) {
//   if (!pkid) {
//     return [];
//   }
//   const [pkType, pkSys] = pkid.split(":");
//   if (pkSys) {
//     return [pkType, pkSys.split("#")[1]];
//   }
//   return [pkType];
// }

function convertItemOut(newItem, keyField) {
  const newData = { ...newItem };

  if (newData.skid) {
    if (keyField) {
      newData[keyField] = newItem.skid.split("#").pop();
    }

    switch (newItem.pkid) {
      case "user":
        [, , newData.sid] = newItem.skid.split("#");
        // console.log('new pid:', newData.pid, newItem.pk2.split('#'));
        break;
      case "relation":
        break;
      default:
        break;
    }
  }

  if (newData.pk2) {
    switch (newItem.pkid) {
      case "group":
      case "version":
      case "user":
        if (!newData.sid) {
          newData.sid = newItem.pk2.split("#").pop();
        }
        break;
      case "system":
        newData.pid = newItem.pk2.split("#").pop();
        // console.log('new pid:', newData.pid, newItem.pk2.split('#'));
        break;
      case "relation":
        break;
      default:
        break;
    }
  }

  return deleteBackendAttributesForQuery(newData);
}
module.exports.convertItemOut = convertItemOut;

function convertKeysIn(object, keys, keyField) {
  let v2Keys;
  const upKeyField = keyField.toUpperCase();
  // const partnerKeyField = getKeyField("partner");
  // const upPartnerKeyField = partnerKeyField.toUpperCase();
  const systemKeyField = getKeyField("system");
  const upSystemKeyField = systemKeyField.toUpperCase();

  switch (object) {
    case "partner":
      v2Keys = {
        pkid: object,
        skid: [upKeyField, keys[keyField]].join("#"),
      };
      break;
    case "system":
      v2Keys = {
        pkid: object,
        skid: [upKeyField, keys[keyField]].join("#"),
      };
      break;
    case "version": {
      // checkRequired(keys, [partnerKeyField]);
      v2Keys = {
        pkid: object,
        skid: [
          upSystemKeyField,
          upKeyField,
          keys[systemKeyField],
          keys[keyField],
        ].join("#"),
      };
      break;
    }
    case "group": {
      // checkRequired(keys, [partnerKeyField]);
      v2Keys = {
        pkid: object,
        skid: [
          upSystemKeyField,
          upKeyField,
          keys[systemKeyField],
          keys[keyField],
        ].join("#"),
      };
      break;
    }
    case "user": {
      // checkRequired(keys, [systemKeyField]);
      v2Keys = {
        pkid: object,
        skid: [
          upSystemKeyField,
          upKeyField,
          keys[systemKeyField],
          keys[keyField],
        ].join("#"),
      };
      break;
    }
    case "authn": {
      // checkRequired(keys, [systemKeyField]);
      v2Keys = {
        pkid: object,
        skid: [
          upSystemKeyField,
          upKeyField,
          keys[systemKeyField],
          keys[keyField],
        ].join("#"),
      };
      break;
    }
    case "role":
      v2Keys = {
        pkid: object,
        skid: [upKeyField, keys[keyField]].join("#"),
      };
      break;
    case "menu":
      v2Keys = {
        pkid: object,
        skid: [upKeyField, keys[keyField]].join("#"),
      };
      break;
    case "relation":
      if (keys.fromKey && keys.toKey) {
        v2Keys = {
          pkid: object,
          skid: ["PARENT", keys.fromKey, keys.toKey].join("#"),
        };
      } else if (keys.gid && keys.sid && keys.uid) {
        v2Keys = {
          pkid: object,
          skid: ["SID", "GID", "UID", keys.sid, keys.gid, keys.uid].join("#"),
        };
      } else if (keys.rid && keys.sid && keys.uid) {
        v2Keys = {
          pkid: object,
          skid: ["SID", "UID", "RID", keys.sid, keys.uid, keys.rid].join("#"),
        };
      } else if (keys.email && keys.sid && keys.uid) {
        v2Keys = {
          pkid: object,
          skid: [keys.email, "SID", "UID", keys.sid, keys.uid].join("#"),
        };
      }
      break;
    case "email":
      if (keys.email) {
        v2Keys = {
          pkid: object,
          skid: keys.email,
        };
      }
      break;
    case "session":
      v2Keys = {
        pkid: object,
        skid: keys.uuid,
      };
      break;
    case "apptoken":
      v2Keys = {
        pkid: object,
        skid: keys.token,
      };
      break;
    default:
      break;
  }

  return v2Keys;
}
module.exports.convertKeysIn = convertKeysIn;

function convertKeysToQuery(object, values) {
  //, keyField
  switch (object) {
    case "partner":
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `PID#`],
        },
      ];
    case "system":
      if (values.pid) {
        return [
          {
            pk2: `PID#SID#${values.pid}`,
          },
          {
            skid: ["BEGINS_WITH", `SID#`],
          },
        ];
      }
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `SID#`],
        },
      ];
    case "group":
      if (values.pid) {
        throw new Error("pid is not part of Group Key");
      }

      if (values.sid) {
        return [
          {
            pkid: object,
          },
          {
            skid: ["BEGINS_WITH", `SID#GID#${values.sid}#`],
          },
        ];
      }
      // else if (values.pid) {
      //   return [
      //     {
      //       pk2: `PID#GID#${values.pid}`,
      //     },
      //     {
      //       skid: ["BEGINS_WITH", `SID#GID#`],
      //     },
      //   ];
      // }
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `SID#GID#`],
        },
      ];
    case "version":
      if (values.pid) {
        throw new Error("pid is not part of Group Key");
      }

      if (values.sid) {
        if (values.baseDate) {
          return [
            {
              pk2: `SID#VID#${values.sid}`,
            },
            {
              validTo: [">=", values.baseDate],
            },
          ];
        }
        return [
          {
            pkid: object,
          },
          {
            skid: ["BEGINS_WITH", `SID#VID#${values.sid}#`],
          },
        ];
      }
      // else if (values.pid) {
      //   if (values.baseDate) {
      //     return [
      //       {
      //         pk2: `PID#VID#${values.pid}`,
      //       },
      //       {
      //         validTo: [">=", values.baseDate],
      //       },
      //     ];
      //   }
      //   return [
      //     {
      //       pk2: `PID#VID#${values.pid}`,
      //     },
      //     {
      //       skid: ["BEGINS_WITH", `PID#VID#`],
      //     },
      //   ];
      // }
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `SID#VID#`],
        },
      ];
    case "user":
      if (values.sid) {
        if (values.uid) {
          return [
            {
              pkid: object,
            },
            {
              skid: ["=", `SID#UID#${values.sid}#${values.uid}`],
            },
          ];
        }
        return [
          {
            pkid: object,
          },
          {
            skid: ["BEGINS_WITH", `SID#UID#${values.sid}#`],
          },
        ];
      }
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `SID#UID#`],
        },
      ];
    case "role":
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `RID#`],
        },
      ];
    case "menu":
      return [
        {
          pkid: object,
        },
        {
          skid: ["BEGINS_WITH", `MID#`],
        },
      ];
    case "relation":
      if (values.fromKey) {
        return [
          {
            pkid: object,
          },
          {
            skid: ["BEGINS_WITH", ["PARENT", values.fromKey].join("#")],
          },
        ];
      } else if (values.gid && values.sid) {
        return [
          {
            pkid: object,
          },
          {
            skid: [
              "BEGINS_WITH",
              ["SID", "GID", "UID", values.sid, values.gid].join("#"),
            ],
          },
        ];
      } else if (values.uid && values.sid) {
        return [
          {
            pkid: object,
          },
          {
            sk2: [
              "BEGINS_WITH",
              ["SID", "UID", "GID", values.sid, values.uid].join("#"),
            ],
          },
        ];
      } else if (values.email) {
        return [
          {
            pkid: object,
          },
          {
            skid: ["BEGINS_WITH", values.email.concat("#")],
          },
        ];
      }
      break;
    case "apptoken":
      if (values.sid) {
        if (values.uid) {
          return [
            {
              pkid: object,
            },
            {
              sk2: ["=", ["SID", "UID", values.sid, values.uid].join("#")],
            },
          ];
        }
        return [
          {
            pkid: object,
          },
          {
            sk2: ["BEGINS_WITH", ["SID", "UID", values.sid].join("#")],
          },
        ];
      }
      break;
    case "notification":
      if (values.sid) {
        if (values.uid) {
          return [
            {
              pkid: object,
            },
            {
              sk2: ["=", ["SID", "UID", values.sid, values.uid].join("#")],
            },
          ];
        }
        return [
          {
            pkid: object,
          },
          {
            sk2: ["=", ["SID", values.sid].join("#")],
          },
        ];
      }
      break;
    default:
      return undefined;
  }
}
module.exports.convertKeysToQuery = convertKeysToQuery;

function convertValuesIn(object, values) {
  //, keyField
  const newValues = deleteBackendAttributesForUpdate(values);
  const partnerKeyField = getKeyField("partner");
  const systemKeyField = getKeyField("system");
  // const upSystemKeyField = systemKeyField.toUpperCase();
  // const upKeyField = keyField.toUpperCase();

  switch (object) {
    case "partner":
      // delete newValues[keyField];
      break;
    case "system":
      newValues.pk2 = `PID#SID#${newValues[partnerKeyField]}`;
      // delete newValues[partnerKeyField];
      // delete newValues[keyField];
      break;
    case "group":
      newValues.pk2 = `SID#GID#${newValues[systemKeyField]}`;
      // delete newValues[systemKeyField];
      // delete newValues[keyField];
      break;
    case "version":
      newValues.pk2 = `SID#VID#${newValues[systemKeyField]}`;
      // delete newValues[systemKeyField];
      // delete newValues[keyField];
      break;
    case "user":
      newValues.pk2 = `SID#UID#${newValues[systemKeyField]}`;
      // newValues.sk2 = [
      //   upSystemKeyField,
      //   upKeyField,
      //   newValues[systemKeyField],
      //   newValues[keyField],
      // ].join("#");
      // delete newValues[systemKeyField];
      // delete newValues[keyField];
      delete newValues.relations; // db에 relations가 들어가는것을 방지
      break;
    case "authn":
      // newValues.pk2 = `AUTHN:SID#UID#${newValues[systemKeyField]}`;
      // delete newValues[systemKeyField];
      // delete newValues[keyField];
      break;
    case "role":
      // delete newValues[keyField];
      break;
    case "menu":
      // delete newValues[keyField];
      break;
    case "relation":
      if (newValues.gid && newValues.sid && newValues.uid) {
        newValues.pk2 = ["SID", "GID", "UID", newValues.sid].join("#");
        newValues.sk2 = [
          "SID",
          "UID",
          "GID",
          newValues.sid,
          newValues.uid,
          newValues.gid,
        ].join("#");
      } else if (newValues.rid && newValues.sid && newValues.uid) {
        newValues.pk2 = ["SID", "UID", "RID", newValues.sid].join("#");
        newValues.sk2 = [
          "RID",
          "SID",
          "UID",
          newValues.rid,
          newValues.sid,
          newValues.uid,
        ].join("#");
      } else if (newValues.email && newValues.sid) {
        newValues.pk2 = ["EMAIL", newValues.sid].join("#");
      }
      break;
    case "email":
      break;
    case "apptoken":
      newValues.pk2 = ["PID", newValues.pid].join("#");
      newValues.sk2 = ["SID", "UID", newValues.sid, newValues.uid].join("#");
      break;
    case "notification":
      if (newValues.pid) {
        newValues.pk2 = ["PID", newValues.pid].join("#");
      }
      if (newValues.sid && newValues.uid) {
        newValues.sk2 = ["SID", "UID", newValues.sid, newValues.uid].join("#");
      } else if (newValues.sid) {
        newValues.sk2 = ["SID", newValues.sid].join("#");
      }
      break;
    default:
      return undefined;
  }

  return removeUndefinedKeys(newValues);
}
module.exports.convertValuesIn = convertValuesIn;

function getKeyField(object1) {
  switch (object1) {
    case "partner":
      return "pid";
    case "system":
      return "sid";
    case "user":
    case "authn":
      return "uid";
    case "version":
      return "vid";
    case "role":
      return "rid";
    case "group":
      return "gid"; // , true];
    case "menu":
      return "mid"; // , true];
    case "notification":
      return "uuid"; // , true];
    default:
      throw new Error(`Unsupported Object1: ${object1}`);
  }
}
module.exports.getKeyField = getKeyField;

async function queryMenuById(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (result) {
    // const outResult = convertItemOut(result, keyField);
    try {
      const allMenus = await queryHierarchyData(
        result,
        tableName,
        object1,
        keyField,
        values,
        context
      );
      return allMenus;
    } catch (ex) {
      console.error(ex);
      return [result];
    }
  }
  return [];
  // return result;
}
module.exports.queryMenuById = queryMenuById;

async function getParentFromRelation(
  tableName,
  object,
  keyField,
  fromKey,
  toKey,
  context
) {
  const { dynamodb, request } = context;
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(
      "relation",
      {
        fromKey,
        toKey,
      },
      ""
    ),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}

// async function queryParentsFromRelation(
//   tableName,
//   object,
//   keyField,
//   fromKey,
//   context
// ) {
//   const { dynamodb, request } = context;
//   const results = await dynamodb.query(
//     tableName,
//     ...convertKeysToQuery(
//       "relation",
//       {
//         fromKey,
//       },
//       ""
//     ),
//     {
//       ...getDdbOptions(request),
//     }
//   );
//   return results;
// }

async function moveItem(thisKeys = {}, toId, targetRoot, options = {}) {
  const {
    direction = "ADD",
    throwOriginError = false,
    tableName,
    object,
    keyField,
    context,
    migrate,
  } = options;
  const { isObject, isTruthy, dynamodb, isFalsy, isArray, request } = context;
  // console.log('moveItem:', direction, thisKeys, toId);

  if (!isObject(thisKeys)) {
    throw new Error("First argument is Object type");
  }

  switch (object) {
    case "group":
      if (!thisKeys.sid) {
        throw new Error("System ID is required");
      }
      break;
    default:
      break;
  }

  checkRequired(thisKeys, [keyField]);

  if (!toId) {
    throw new Error("Target ID is required");
  }

  if (!targetRoot) {
    throw new Error("Target Root is required");
  }

  let toKeys;
  let fromKeys;

  switch (object) {
    case "group":
      toKeys = {
        sid: thisKeys.sid,
        gid: toId,
      };
      fromKeys = {
        sid: thisKeys.sid,
        gid: thisKeys.gid,
      };

      break;
    default:
      toKeys = {
        [keyField]: toId,
      };
      fromKeys = {
        [keyField]: thisKeys[keyField],
      };
      break;
  }

  const rootKeys = { ...toKeys, [keyField]: targetRoot };

  if (direction === "ADD") {
    switch (object) {
      case "menu":
      case "group": {
        const allTargetGroupsFromRoot = await (object === "menu"
          ? queryMenuById
          : queryGroupById)(
          tableName,
          object,
          keyField,
          { ...rootKeys, IncludeLowerLevels: true },
          context
        );
        const thisKeyExists =
          allTargetGroupsFromRoot.findIndex(
            (each) => each[keyField] === thisKeys[keyField]
          ) >= 0;
        if (thisKeyExists) {
          const error = new Error(
            "요청한 객체는 이미 타깃의 최상위 객체에 소속되어 있습니다"
          );
          error.code = "ALREADY_ASSIGNED";
          if (migrate === true) {
            // pass
          } else {
            console.error(error);
            throw error;
          }
        }

        const allGroupsFromSource = await (object === "menu"
          ? queryMenuById
          : queryGroupById)(
          tableName,
          object,
          keyField,
          { ...thisKeys, IncludeLowerLevels: true },
          context
        );
        allGroupsFromSource.forEach((srcObj) => {
          const srcKeyExists =
            allTargetGroupsFromRoot.findIndex(
              (each) => each[keyField] === srcObj[keyField]
            ) >= 0;
          if (srcKeyExists) {
            const error = new Error(
              [
                "요청한 객체의 하위 객체가 이미 타깃의 최상위 객체에 소속되어 있습니다",
                srcObj[keyField],
                srcObj.name,
              ].join(" ")
            );
            error.code = "ALREADY_ASSIGNED";
            if (migrate === true) {
              // pass
            } else {
              console.error(error);
              throw error;
            }
          }
        });
        // const [sourceItem] = await queryParentsFromRelation(
        //   tableName,
        //   object,
        //   keyField,
        //   convertKeysIn(object, thisKeys, keyField).skid,
        //   context
        // );
        // if (sourceItem && isTruthy(extractParents(sourceItem, context))) {
        //   throw new Error("요청한 객체는 이미 다른 객체에 종속되어 있습니다");
        // }
        break;
      }
      // break;
      //   {
      //     const [sourceItem] = await queryGroupById(
      //       tableName,
      //       object,
      //       keyField,
      //       thisKeys,
      //       context
      //     );
      //     if (sourceItem && isTruthy(extractParents(sourceItem, context))) {
      //       throw new Error("요청한 그룹은 이미 다른 그룹에 종속되어 있습니다");
      //     }
      //   }
      //   break;
      // case "menu":
      //   {
      //     const sourceItem = await queryMenuById(
      //       tableName,
      //       object,
      //       keyField,
      //       thisKeys,
      //       context
      //     );
      //     if (sourceItem && isTruthy(extractParents(sourceItem, context))) {
      //       throw new Error("요청한 메뉴는 이미 다른 메뉴에 종속되어 있습니다");
      //     }
      //   }
      //   break;
      default:
        throw new Error(`${object} does not support moveItem()`);
    }

    // const [sourceItem] = await queryById({ Keys: thisKeys }, options);
    // if (sourceItem && isTruthy(extractParents(sourceItem))) {
    //   throw new Error('요청한 객체는 이미 다른 객체에 종속되어 있습니다');
    // }
  }

  // const returnFields = [keyField];

  const batchRequestKeys = [toKeys, fromKeys];

  // console.log('toKeys:', toKeys);
  // console.log('fromKeys:', fromKeys);
  let oldResults = await dynamodb.batchGetItem(
    tableName,
    batchRequestKeys.map((eachKeys) =>
      convertKeysIn(object, eachKeys, keyField)
    ),
    { ...getDdbOptions(request) }
  );
  // console.log('oldResults:', JSON.stringify(oldResults, null, 2));
  oldResults = batchRequestKeys.map((eachKeys) => {
    const eachOld = oldResults.find(
      (eachOld2) =>
        eachOld2.skid === convertKeysIn(object, eachKeys, keyField).skid
    );
    return convertItemOut(eachOld, keyField);
  });

  let oldItemTo;
  let oldItemFrom;
  if (oldResults.length === 0) {
    throw new Error("대상 객체와 요청 객체는 존재하지 않습니다.");
  } else {
    if (oldResults.length === 2) {
      [oldItemTo, oldItemFrom] = oldResults;
    } else if (oldResults[0][keyField] === toId) {
      [oldItemTo] = oldResults;
    } else {
      [oldItemFrom] = oldResults;
    }

    if (isFalsy(oldItemTo)) {
      throw new Error(`대상 객체 ${toKeys[keyField]}는 존재하지 않습니다.`);
    }
    if (isFalsy(oldItemFrom)) {
      throw new Error("요청한 객체는 존재하지 않습니다.");
    }
  }

  switch (object) {
    case "group":
      if (oldItemFrom.version) {
        throw new Error("Root 객체는 다른 객체로 이동할수 없습니다");
      }
      break;
    default:
      break;
  }

  // update toId ADD children [thisKeys.gid]
  try {
    const result = await dynamodb.updateItem(
      tableName,
      convertKeysIn(object, toKeys, keyField),
      {
        children: [thisKeys[keyField]],
      },
      {
        ...getDdbOptions(request),
        operations: { children: direction },
        sets: { children: "string" },
        returnValues: "UPDATED_NEW",
        conditions: {
          children: {
            operation: direction === "ADD" ? "not,contains" : "contains",
            value: thisKeys[keyField],
          },
        },
      }
    );
    if (direction === "ADD") {
      if (!isArray(result.children)) {
        throw new Error("children must be array");
      }
      if (!result.children.includes(thisKeys[keyField])) {
        throw new Error(
          "Source ID was not added into Target's children property"
        );
      }
    }
    // console.log('add this to target.children[]:', result);
  } catch (ex) {
    if (throwOriginError === true) {
      throw ex;
    }

    if (ex.code === "ConditionalCheckFailedException") {
      if (direction === "ADD") {
        const error = new Error(
          "요청한 객체는 이미 목표객체에 포함되어 있습니다"
        );
        error.code = "ALREADY_ASSIGNED";
        if (migrate === true) {
          // pass
        } else {
          console.error(error);
          throw error;
        }
      } else {
        const error = new Error("요청한 객체는 목표객체에 없습니다");
        console.error(error);
        throw error;
      }
    } else {
      throw ex;
    }
  }

  // // get from.children and from.grand_children
  const thisItem = await dynamodb.getItem(
    tableName,
    convertKeysIn(object, fromKeys, keyField),
    {
      returnFields: ["children", "grand_children"],
      ...getDdbOptions(request),
    }
  );
  const thisAllChildren = extractChildren(thisItem, context);

  // get to.parents
  // const groupTo = await dynamodb.getItem(
  //   tableName,
  //   convertKeysIn(object, toKeys, keyField),
  //   {
  //     returnFields: ["parent", "grand_parents"],
  //     ...getDdbOptions(request),
  //   }
  // );
  const groupTo = await getParentFromRelation(
    tableName,
    object,
    keyField,
    convertKeysIn(object, rootKeys, keyField).skid,
    convertKeysIn(object, toKeys, keyField).skid,
    context
  );

  // console.log('groupTo:', groupTo);
  const parentsTo = extractParents(groupTo, context);
  // if (groupTo.grand_parents === undefined) {
  //     // no parents
  //     grandParents = [];
  // }
  // else {
  //     if (!isArray(groupTo.grand_parents)) {
  //         throw new Error(`grand_parents must be array`);
  //     }
  //     grandParents = groupTo.grand_parents;
  // }

  // add to.parents[] to from.grand_parents
  const fromOptions = isTruthy(parentsTo)
    ? {
        operations: { grand_parents: direction },
        sets: { grand_parents: "string" },
      }
    : { operations: {} };

  if (direction === "ADD") {
    // pass
  } else {
    fromOptions.operations.parent = "REMOVE";
  }

  await dynamodb.transaction(
    tableName,
    [
      // set to.gid to from.parent
      {
        type: "Update",
        keys: convertKeysIn(object, fromKeys, keyField),
        values: {
          parents: [toId],
          ...(isTruthy(parentsTo) && {
            grand_parents: parentsTo,
          }),
        },
        options: {
          operations: {
            parents: direction,
            ...(isTruthy(parentsTo) && {
              grand_parents: direction,
            }),
          },
          sets: {
            parents: "string",
            ...(isTruthy(parentsTo) && {
              grand_parents: "string",
            }),
          },
        },
      },
      {
        type: "Update",
        keys: convertKeysIn(
          "relation",
          {
            fromKey: convertKeysIn(object, rootKeys, keyField).skid,
            toKey: convertKeysIn(object, fromKeys, keyField).skid,
          },
          ""
        ),
        values: {
          parent: toId,
          ...(isTruthy(parentsTo) && {
            grand_parents: parentsTo,
          }),
        },
        options: fromOptions,
      },
      // add this.allChildren[] to to.grand_children
      isTruthy(thisAllChildren) && {
        type: "Update",
        keys: convertKeysIn(object, toKeys, keyField),
        values: {
          grand_children: thisAllChildren,
        },
        options: {
          operations: { grand_children: direction },
          sets: { grand_children: "string" },
        },
      },
      // LOOP: add from.gid to to.parents[]'s grand_children
    ]
      .concat(
        parentsTo.map((parentId) => ({
          type: "Update",
          keys: convertKeysIn(
            object,
            {
              ...toKeys,
              [keyField]: parentId,
            },
            keyField
          ),
          values: {
            grand_children: [thisKeys[keyField]],
          },
          options: {
            operations: { grand_children: direction },
            sets: { grand_children: "string" },
          },
        }))
      )
      .concat(
        thisAllChildren.map((childId) => ({
          type: "Update",
          keys: convertKeysIn(
            "relation",
            {
              fromKey: convertKeysIn(object, rootKeys, keyField).skid,
              toKey: {
                ...fromKeys,
                [keyField]: childId,
              },
            },
            ""
          ),
          values: {
            grand_parents: [toId],
          },
          options: {
            operations: { grand_parents: direction },
            sets: { grand_parents: "string" },
          },
        }))
      )
      .concat(
        thisAllChildren.map((childId) => ({
          type: "Update",
          keys: convertKeysIn(
            object,
            {
              ...fromKeys,
              [keyField]: childId,
            },
            keyField
          ),
          values: {
            grand_parents: [toId],
          },
          options: {
            operations: { grand_parents: direction },
            sets: { grand_parents: "string" },
          },
        }))
      )
      .filter(Boolean),
    { ...getDdbOptions(request) }
  );

  const thisFinalItem = await dynamodb.getItem(
    tableName,
    convertKeysIn(object, thisKeys, keyField),
    { ...getDdbOptions(request) }
  );
  return convertItemOut(thisFinalItem, keyField);
}
module.exports.moveItem = moveItem;

async function assignItem(thisKeys = {}, toId, targetRoot, options = {}) {
  return await moveItem(thisKeys, toId, targetRoot, {
    direction: "ADD",
    ...options,
  });
}
module.exports.assignItem = assignItem;
async function unassignItem(thisKeys = {}, fromId, targetRoot, options = {}) {
  return await moveItem(thisKeys, fromId, targetRoot, {
    direction: "SUB",
    ...options,
  });
}
module.exports.unassignItem = unassignItem;

async function relocateItem(thisKeys = {}, toId, targetRoot, options = {}) {
  const { keyField } = options;

  checkRequired(thisKeys, ["parent"]);
  if (!toId) {
    throw new Error("대상 객체는 필수입니다");
  }
  if (!targetRoot) {
    throw new Error("대상 최상위 객체는 필수입니다");
  }
  if (toId === thisKeys[keyField]) {
    throw new Error("대상 객체가 지금 이동하고자 하는 객체 자신입니다");
  }

  // const thisItem = await dynamodb.getItem(tableName, convertKeysIn(
  // object, thisKeys, keyField));
  let result;
  // if (thisItem.parent) {
  result = await unassignItem(thisKeys, thisKeys.parent, targetRoot, options);
  // }
  // if (toId) {
  result = await assignItem(thisKeys, toId, targetRoot, options);
  // }
  return result;
}
module.exports.relocateItem = relocateItem;

async function createPartner(tableName, object1, keyField, values, context) {
  const { dynamodb, makeid, isTruthy, request } = context;

  checkRequired(values, ["name"]);

  const migrating = values.MIGRATE === true;

  if (migrating === true) {
    checkRequired(values, ["id"]);
  } else {
    if (isTruthy(values[keyField])) {
      throw new Error(`'${keyField}' should not be provided`);
    }
  }

  const newBody = {
    ...values,
  };
  if (migrating === true) {
    newBody[keyField] = newBody.id;
    delete newBody.MIGRATE;
    delete newBody.id;
  } else {
    newBody[keyField] = makeid(10);
  }

  delete newBody.roles; // addRolesToPartner로 role 추가.

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (isTruthy(values.roles)) {
    await addRolesToPartner(
      tableName,
      object1,
      keyField,
      { pid: result.pid, roleIds: values.roles },
      context
    );
  }

  return result;
}
module.exports.createPartner = createPartner;

async function updatePartner(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };

  // delete newBody.roles;

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
      sets: {
        roles: "string",
      },
    }
  );
  return result;
}
module.exports.updatePartner = updatePartner;

async function queryPartnerById(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.queryPartnerById = queryPartnerById;

async function queryAllPartners(
  tableName,
  object1,
  keyField,
  { dynamodb, request }
) {
  const newBody = {};
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryAllPartners = queryAllPartners;

async function createSystem(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, makeid, isTruthy, request }
) {
  checkRequired(values, [getKeyField("partner"), "name"]);

  const migrating = values.MIGRATE === true;

  if (migrating === true) {
    checkRequired(values, ["id"]);
  } else {
    if (isTruthy(values[keyField])) {
      throw new Error(`'${keyField}' should not be provided`);
    }
  }

  const newBody = {
    ...values,
  };
  if (migrating === true) {
    newBody[keyField] = newBody.id;
    delete newBody.MIGRATE;
    delete newBody.id;
    delete newBody.partnerID;
  } else {
    newBody[keyField] = makeid(10);
  }

  delete newBody.roles;

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.createSystem = createSystem;

async function updateSystem(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = removeUndefinedKeys({
    ...values,
  });

  delete newBody.roles;

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.updateSystem = updateSystem;

async function querySystemById(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.querySystemById = querySystemById;

async function querySystemsByPartnerId(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request, isTruthy }
) {
  checkRequired(values, [getKeyField("partner")]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
  };
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      indexName: "pk2-skid-index",
      ...getDdbOptions(request),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.querySystemsByPartnerId = querySystemsByPartnerId;

async function createGroup(
  tableName,
  object1,
  keyField,
  values,
  context,
  to,
  targetRoot
) {
  const { dynamodb, makeid, isTruthy, request } = context;
  checkRequired(values, [getKeyField("system"), "name"]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
    [keyField]: makeid(4),
  };
  let result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (result && to && targetRoot) {
    result = await assignItem(newBody, to, targetRoot, {
      tableName,
      object: object1,
      keyField,
      context,
    });
  }

  return result;
}
module.exports.createGroup = createGroup;

async function updateGroup(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField, getKeyField("system")]);

  const newBody = {
    ...values,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.updateGroup = updateGroup;

async function updateUserInGroup(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField, "sid", "uid"]);

  const newBody = {
    ...values,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn("relation", newBody, ""),
    convertValuesIn("relation", newBody, ""),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.updateUserInGroup = updateUserInGroup;

function extractParents(item, context, options = {}) {
  const { excludeGrand = false } = options;

  const { isTruthy, isArray } = context;
  const parents = [];
  if (isTruthy(item)) {
    if (isTruthy(item.parent)) {
      parents.push(item.parent);
    }
    if (isTruthy(item.parents)) {
      parents.push(...item.parents);
    }
    if (excludeGrand === true) {
      return parents;
    }
    if (isArray(item.grand_parents)) {
      parents.push(...item.grand_parents);
    }
  }
  return parents;
}
module.exports.extractParents = extractParents;

function extractChildren(item, context) {
  const { isTruthy, isArray } = context;
  const children = [];
  if (isTruthy(item)) {
    if (isTruthy(item.children)) {
      children.push(...item.children);
    }
    if (isArray(item.grand_children)) {
      children.push(...item.grand_children);
    }
  }
  return children;
}
module.exports.extractChildren = extractChildren;

async function queryHierarchyData(
  thisItem,
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, isFalsy, request } = context;
  const {
    IncludeLowerLevels = false,
    IncludeHigherLevels = false,
    ExcludeGrand = false,
  } = values;

  if (IncludeHigherLevels) {
    if (thisItem.parents && thisItem.parents.length > 1) {
      throw new Error("This has more than one parents");
    }
  }

  // const parents = extractParents(thisItem, context).filter(Boolean);

  if (IncludeLowerLevels !== true && IncludeHigherLevels !== true) {
    return [thisItem];
  }

  const rootItem = thisItem;
  // let rootItem;
  // if (parents.length === 0) {
  //   rootItem = thisItem;
  // } else {
  //   const parentItems = await dynamodb.batchGetItem(
  //     tableName,
  //     parents.map((key) => {
  //       switch (object1) {
  //         case "group":
  //           return convertKeysIn(
  //             object1,
  //             { sid: values.sid, gid: key },
  //             keyField
  //           );
  //         // case 'system':
  //         //   return convertKeysIn(object1, { pid:
  //         // values.pid, sid: key }, keyField);
  //         // case 'user':
  //         //   return convertKeysIn(object1, { sid:
  //         // values.sid, uid: key }, keyField);
  //         default:
  //           return convertKeysIn(
  //             object1,
  //             {
  //               [keyField]: key,
  //             },
  //             keyField
  //           );
  //       }
  //     }),
  //     {
  //       ...getDdbOptions(request),
  //     }
  //   );
  //   rootItem = parentItems.find((each) => each.version);
  // }

  if (!rootItem) {
    throw new Error("Can not find root item");
  }

  const keys = [];
  if (IncludeLowerLevels && rootItem.children) {
    keys.push(...rootItem.children.filter(Boolean));
  }
  if (ExcludeGrand === true) {
    // pass
  } else {
    if (IncludeLowerLevels && rootItem.grand_children) {
      keys.push(...rootItem.grand_children.filter(Boolean));
    }
  }

  const rootParents = extractParents(rootItem, context, {
    excludeGrand: ExcludeGrand,
  }).filter(Boolean);

  if (IncludeHigherLevels && rootParents) {
    keys.push(...rootParents);
  }

  if (isFalsy(keys)) {
    return [thisItem];
  }

  console.log(
    "keys:",
    keys,
    object1,
    keyField,
    IncludeHigherLevels,
    rootParents,
    JSON.stringify(rootItem)
  );

  // switch (object) {
  //   case 'group':
  //     returnFields = ['pkid', 'skid', 'pk2', 'gid', 'name', ...REL_FIELDS];
  //     if (Keys.sid) {
  //       returnFields.push(`sys-${Keys.sid}`);
  //     }
  //     break;
  //   case 'menu':
  //     returnFields = ['pkid', 'skid', 'isDir', 'mid', 'name', ...REL_FIELDS];
  //     break;
  //   default:
  //     break;
  // }

  const keysSet = new Set();
  keys.forEach((key) => {
    keysSet.add(key);
  });
  console.log(keysSet.size, keys.length);

  const otherItems = await dynamodb.batchGetItem(
    tableName,
    Array.from(keysSet).map((key) => {
      switch (object1) {
        case "group":
          return convertKeysIn(
            object1,
            { sid: values.sid, gid: key },
            keyField
          );
        // case 'system':
        //   return convertKeysIn(object1, { pid:
        // values.pid, sid: key }, keyField);
        // case 'user':
        //   return convertKeysIn(object1, { sid:
        // values.sid, uid: key }, keyField);
        default:
          return convertKeysIn(
            object1,
            {
              [keyField]: key,
            },
            keyField
          );
      }
    }),
    {
      ...getDdbOptions(request),
    }
  );
  console.log(
    "otherItems:",
    JSON.stringify(otherItems),
    object1,
    keyField,
    JSON.stringify(keys)
  );

  // delete rootItem.grand_children;

  const allItems = [rootItem].concat(otherItems);
  // console.log('allItems:', allItems);

  return allItems;
}
module.exports.queryHierarchyData = queryHierarchyData;

function removeSysFields(group) {
  Object.keys(group)
    .filter((key) => key.startsWith("sys-"))
    .forEach((key) => {
      delete group[key];
    });
  return group;
}
module.exports.removeSysFields = removeSysFields;

const changeToUsers = (users, relations) => (data) => {
  const userObj = users.reduce((acc, user) => {
    acc[user.uid] = { ...user, groups: undefined };
    return acc;
  }, {});
  const relationObj = relations.reduce((acc, rel) => {
    acc[`${rel.gid}-${rel.uid}`] = rel;
    return acc;
  }, {});

  const newData = { ...data };

  // newData.users = newData[fieldName];
  // delete newData[fieldName];
  // console.log("newData.userIds:", newData.userIds);

  if (newData.userIds.length > 0) {
    newData.users = newData.userIds
      .map((uid) => userObj[uid] || { uid })
      .map((each) => ({ ...each, gid: newData.gid }))
      .map((each) => ({ ...each, ...relationObj[`${each.gid}-${each.uid}`] }));
  } else {
    newData.users = [];
  }

  return newData;
};

async function mergeUsersToGroups(
  groups,
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, request } = context;
  // const userFieldName = `sys-${values.sid}`;
  // const userIds = Array.from(
  //   groups.reduce((acc, each) => {
  //     if (each[userFieldName]) {
  //       each[userFieldName].forEach((uid) => {
  //         acc.add(uid);
  //       });
  //     }
  //     return acc;
  //   }, new Set())
  // );

  const userIds = new Set();
  const relations = [];

  for (const group of groups) {
    const result = await dynamodb.query(
      tableName,
      ...convertKeysToQuery(
        "relation",
        {
          sid: values.sid,
          gid: convertItemOut(group, "gid").gid,
        },
        ""
      ),
      {
        ...getDdbOptions(request),
      }
    );

    group.userIds = [];

    result.forEach((each) => {
      relations.push(each);
      userIds.add(each.uid);
      group.userIds.push(each.uid);
    });

    // console.log("group:", group);
  }

  if (userIds.size === 0) {
    return groups;
  }

  const users = await dynamodb.batchGetItem(
    tableName,
    Array.from(userIds).map((uid) =>
      convertKeysIn("user", { sid: values.sid, uid }, getKeyField("user"))
    ),
    {
      ...getDdbOptions(request),
    }
  );

  // console.log("users:", users);

  // return convertToHierarchy(groups.map(changeToUsers(
  // userFieldName, users)), options);
  return groups.map(
    changeToUsers(
      // userFieldName,
      users.map((each) => convertItemOut(each, "uid")),
      relations.map((each) => convertItemOut(each, ""))
    )
  );
}
module.exports.mergeUsersToGroups = mergeUsersToGroups;

async function queryGroupById(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField]);
  checkRequired(values, [getKeyField("system")]);

  // if (values.IncludeUsers === true) {
  // } else {
  // if (isTruthy(values[getKeyField("system")])) {
  //   throw new Error(`'${getKeyField("system")}' should not be provided`);
  // }
  // }

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (result) {
    // const outResult = convertItemOut(result, keyField);
    const allGroups = await queryHierarchyData(
      result,
      tableName,
      object1,
      keyField,
      values,
      context
    );
    const outAllGroups = allGroups.map((each) =>
      convertItemOut(each, keyField)
    );

    if (values.IncludeUsers === true) {
      const groupsWithUsers = await mergeUsersToGroups(
        outAllGroups,
        tableName,
        object1,
        keyField,
        values,
        context
      );
      return groupsWithUsers.map(removeSysFields);
    }
    return outAllGroups;
  }
  return [];
}
module.exports.queryGroupById = queryGroupById;

async function queryGroupsByPartnerId(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, isTruthy, request }
) {
  checkRequired(values, [getKeyField("partner")]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
  };
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      indexName: "pk2-skid-index",
      ...getDdbOptions(request),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryGroupsByPartnerId = queryGroupsByPartnerId;

async function createVersion(tableName, object1, keyField, values, context) {
  const { dynamodb, makeid, isTruthy, request } = context;
  checkRequired(values, [getKeyField("system"), "name"]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
    [keyField]: makeid(4),
  };
  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  const outVersion = convertItemOut(result, keyField);
  if (outVersion.vid) {
    const groupKeyField = getKeyField("group");
    const rootGroup = await createGroup(
      tableName,
      "group",
      groupKeyField,
      { ...values, version: outVersion.vid },
      context
    );
    const outGroup = convertItemOut(rootGroup, groupKeyField);
    if (outGroup.gid) {
      const newVersion = await updateVersion(
        tableName,
        object1,
        keyField,
        { sid: values.sid, vid: outVersion.vid, root: outGroup.gid },
        context
      );
      return newVersion;
    }
  }

  return result;
}
module.exports.createVersion = createVersion;

async function updateVersion(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField, getKeyField("system")]);

  const newBody = {
    ...values,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.updateVersion = updateVersion;

async function queryVersionById(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField, getKeyField("system")]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.queryVersionById = queryVersionById;

// async function queryVersionsByPartnerId(
//   tableName,
//   object1,
//   keyField,
//   values,
//   { dynamodb, isTruthy }
// ) {
//   checkRequired(values, [getKeyField("system")]);

//   if (isTruthy(values[keyField])) {
//     throw new Error(`'${keyField}' should not be provided`);
//   }

//   const newBody = {
//     ...values,
//   };
//   const result = await dynamodb.query(
//     tableName,
//     ...convertKeysToQuery(object1, newBody, keyField),
//     {
//       indexName: "pk2-skid-index",
//       ...getDdbOptions(request),
//     }
//   );
//   // draft.response.body = { newBody, result };
//   return result;
// }
// module.exports.queryVersionsByPartnerId = queryVersionsByPartnerId;

async function queryVersionsBySystemId(
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, request } = context;

  // const partnerKeyField = getKeyField("partner");
  const systemKeyField = getKeyField("system");
  checkRequired(values, [systemKeyField]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      // indexName: "pk2-skid-index",
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.queryVersionsBySystemId = queryVersionsBySystemId;

async function getCurrentVersion(
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, request, kst } = context;

  const newValues = {
    ...values,
  };
  // if (!newValues.pid) {
  //   newValues.pid = request.partnerId;
  // }
  if (!newValues.sid) {
    newValues.sid = request.systemId;
  }
  if (!newValues.baseDate) {
    newValues.baseDate = kst.format("YYYY-MM-DD");
  }

  // const partnerKeyField = getKeyField("partner");
  const systemKeyField = getKeyField("system");
  checkRequired(newValues, ["baseDate", systemKeyField]);

  // const systemData = await querySystemById(
  //   tableName,
  //   "system",
  //   systemKeyField,
  //   { pid: newValues.pid, sid: newValues.sid },
  //   context
  // );

  // if (isFalsy(systemData.versions)) {
  //   throw new Error("요청한 시스템에 조직 버전이 없습니다");
  // }

  const versions = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(
      object1,
      {
        sid: newValues.sid,
        baseDate: newValues.baseDate,
      },
      keyField
    ),
    {
      ...getDdbOptions(request),
      indexName: "pk2-validTo-index",
      filters: {
        validFrom: {
          operation: "<=",
          value: newValues.baseDate,
        },
        // skid: {
        //   operation: "IN",
        //   value: systemData.versions.map(
        //     (vid) =>
        //       convertKeysIn(object1, { pid: newValues.pid, vid },
        // keyField).skid
        //   ),
        // },
      },
    }
  );

  if (versions.length === 0) {
    throw new Error("유효한 조직 버전이 없습니다");
  }

  const version = versions[0];

  if (values.includeGroups !== true) {
    return { version: convertItemOut(version, "vid") };
  }

  const groups = await queryGroupById(
    tableName,
    "group",
    "gid",
    {
      sid: newValues.sid,
      gid: version.root,
      IncludeLowerLevels: true,
      IncludeHigherLevels: false,
      IncludeUsers: values.includeUsers,
    },
    context
  );

  return { version: convertItemOut(version, "vid"), groups };
}
module.exports.getCurrentVersion = getCurrentVersion;

async function addUsersToGroup(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField, "userIds", "sid"]);

  // const sysAttrName = ["sys", values.sid].join("-");

  // await dynamodb.transaction(
  //   [
  //     // add group to user
  //     ...values.userIds.map((eachUid) => ({
  //       tableName,
  //       type: "Update",
  //       keys: convertKeysIn(
  //         "user",
  //         { pid: values.pid, sid: values.sid, uid: eachUid },
  //         getKeyField("user")
  //       ),
  //       values: {
  //         groups: [values[keyField]],
  //       },
  //       options: {
  //         operations: {
  //           groups: "ADD",
  //         },
  //         sets: { groups: "string" },
  //       },
  //     })),

  //     // add user to group
  //     {
  //       tableName,
  //       type: "Update",
  //       keys: convertKeysIn(
  //         "group",
  //         {
  //           pid: values.pid,
  //           gid: values[keyField],
  //         },
  //         keyField
  //       ),
  //       values: {
  //         [sysAttrName]: values.userIds,
  //       },
  //       options: {
  //         operations: {
  //           [sysAttrName]: "ADD",
  //         },
  //         sets: {
  //           [sysAttrName]: "string",
  //         },
  //       },
  //     },
  //   ],
  //   {
  //     ...getDdbOptions(request),
  //   }
  // );

  await dynamodb.transaction(
    values.userIds.map((eachUid) => ({
      tableName,
      type: "Update",
      keys: convertKeysIn(
        "relation",
        {
          sid: values.sid,
          uid: eachUid,
          [keyField]: values[keyField],
        },
        ""
      ),
      values: convertValuesIn(
        "relation",
        {
          sid: values.sid,
          uid: eachUid,
          [keyField]: values[keyField],
        },
        ""
      ),
      options: {
        // operations: {
        //   groups: "ADD",
        // },
        // sets: { groups: "string" },
      },
    })),
    {
      ...getDdbOptions(request),
    }
  );

  const toGroupData = await queryGroupById(
    tableName,
    object1,
    keyField,
    {
      sid: values.sid,
      gid: values.gid,
      IncludeLowerLevels: true,
      IncludeHigherLevels: true,
      IncludeUsers: true,
    },
    context
  );

  // const result = await queryGroupById(tableName,
  // object1,
  // keyField,
  // {pid: values.pid, gid: values.gid},
  // context);
  //   stage,
  //   body: {
  //     Object: 'group', Type: 'Query', Keys: { pid: systemItem.pid,
  // sid: keys.sid, gid: toGroupData.root }, IncludeLowerLevels: true,
  //   },
  // });
  return toGroupData;
}
module.exports.addUsersToGroup = addUsersToGroup;

// async function addVersionsToSystem(
//   tableName,
//   object1,
//   keyField,
//   values,
//   context
// ) {
//   const { dynamodb, isArray, isString } = context;
//   let newValues;
//   if (keyField === "vid") {
//     checkRequired(values, [keyField, "systemIds", "pid"]);
//     if (!isArray(values.systemIds)) {
//       throw new Error("systemIds must be Array");
//     }
//     values.systemIds.forEach((each) => {
//       if (!isString(each)) {
//         throw new Error("systemIds's element must be String");
//       }
//     });
//     newValues = {
//       pid: values.pid,
//       systemIds: values.systemIds,
//       versionIds: [values[keyField]],
//     };
//   } else {
//     checkRequired(values, [keyField, "versionIds", "pid"]);
//     if (!isArray(values.versionIds)) {
//       throw new Error("versionIds must be Array");
//     }
//     values.versionIds.forEach((each) => {
//       if (!isString(each)) {
//         throw new Error("versionIds's element must be String");
//       }
//     });
//     newValues = {
//       pid: values.pid,
//       systemIds: [values[keyField]],
//       versionIds: values.versionIds,
//     };
//   }

//   // const groupTableName = getTableName("group", stage);
//   // const groupKeyField = getKeyField("group")[0];

//   await dynamodb.transaction(
//     [
//       // add system to version.systems
//       ...newValues.versionIds.map((eachVid) => ({
//         tableName,
//         type: "Update",
//         keys: convertKeysIn(
//           "version",
//           { pid: newValues.pid, vid: eachVid },
//           getKeyField("version")
//         ),
//         values: {
//           systems: newValues.systemIds,
//         },
//         options: {
//           operations: {
//             systems: "ADD",
//           },
//           sets: { systems: "string" },
//         },
//       })),

//       // add version to system.versions
//       ...newValues.systemIds.map((eachSid) => ({
//         tableName,
//         type: "Update",
//         keys: convertKeysIn(
//           "system",
//           {
//             pid: newValues.pid,
//             sid: eachSid,
//           },
//           getKeyField("system")
//         ),
//         values: {
//           versions: newValues.versionIds,
//         },
//         options: {
//           operations: {
//             versions: "ADD",
//           },
//           sets: {
//             versions: "string",
//           },
//         },
//       })),
//     ],
//     {
//       ...getDdbOptions(request),
//     }
//   );
// }
// module.exports.addVersionsToSystem = addVersionsToSystem;

async function addRolesToPartner(
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField, "roleIds"]);

  await dynamodb.transaction(
    [
      // add partner to role.partners
      ...values.roleIds.map((eachRid) => ({
        tableName,
        type: "Update",
        keys: convertKeysIn("role", { rid: eachRid }, getKeyField("role")),
        values: {
          partners: [values[keyField]],
        },
        options: {
          operations: {
            partners: "ADD",
          },
          sets: { partners: "string" },
        },
      })),

      // add role to system.roles
      {
        tableName,
        type: "Update",
        keys: convertKeysIn(
          object1,
          {
            [keyField]: values[keyField],
          },
          keyField
        ),
        values: {
          roles: values.roleIds,
        },
        options: {
          operations: {
            roles: "ADD",
          },
          sets: {
            roles: "string",
          },
        },
      },
    ],
    {
      ...getDdbOptions(request),
    }
  );

  const toPartnerData = await queryPartnerById(
    tableName,
    object1,
    keyField,
    {
      pid: values.pid,
    },
    context
  );

  return toPartnerData;
}
module.exports.addRolesToPartner = addRolesToPartner;

async function addRolesToSystem(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField, "roleIds"]);

  // const groupTableName = getTableName("group", stage);
  // const groupKeyField = getKeyField("group")[0];

  await dynamodb.transaction(
    [
      // add system to role.systems
      ...values.roleIds.map((eachRid) => ({
        tableName,
        type: "Update",
        keys: convertKeysIn("role", { rid: eachRid }, getKeyField("role")),
        values: {
          systems: [values[keyField]],
        },
        options: {
          operations: {
            systems: "ADD",
          },
          sets: { systems: "string" },
        },
      })),

      // add role to system.roles
      {
        tableName,
        type: "Update",
        keys: convertKeysIn(
          object1,
          {
            [keyField]: values[keyField],
          },
          keyField
        ),
        values: {
          roles: values.roleIds,
        },
        options: {
          operations: {
            roles: "ADD",
          },
          sets: {
            roles: "string",
          },
        },
      },
    ],
    {
      ...getDdbOptions(request),
    }
  );

  const toSystemData = await querySystemById(
    tableName,
    object1,
    keyField,
    {
      sid: values.sid,
    },
    context
  );

  // const result = await queryGroupById(tableName,
  // object1,
  // keyField,
  // {pid: values.pid, gid: values.gid},
  // context);
  //   stage,
  //   body: {
  //     Object: 'group', Type: 'Query', Keys: { pid: systemItem.pid,
  // sid: keys.sid, gid: toGroupData.root }, IncludeLowerLevels: true,
  //   },
  // });
  return toSystemData;
}
module.exports.addRolesToSystem = addRolesToSystem;

async function addRolesToGroup(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField, "roleIds"]);

  // const groupTableName = getTableName("group", stage);
  // const groupKeyField = getKeyField("group")[0];

  await dynamodb.transaction(
    [
      // add group to role.groups
      ...values.roleIds.map((eachRid) => ({
        tableName,
        type: "Update",
        keys: convertKeysIn("role", { rid: eachRid }, getKeyField("role")),
        values: {
          groups: [values[keyField]],
        },
        options: {
          operations: {
            groups: "ADD",
          },
          sets: { groups: "string" },
        },
      })),

      // add roles to group.roles
      {
        tableName,
        type: "Update",
        keys: convertKeysIn(
          object1,
          {
            sid: values.sid,
            [keyField]: values[keyField],
          },
          keyField
        ),
        values: {
          roles: values.roleIds,
        },
        options: {
          operations: {
            roles: "ADD",
          },
          sets: {
            roles: "string",
          },
        },
      },
    ],
    {
      ...getDdbOptions(request),
    }
  );

  const resultData = await queryGroupById(
    tableName,
    object1,
    keyField,
    {
      sid: values.sid,
      [keyField]: values[keyField],
    },
    context
  );

  // const result = await queryGroupById(tableName,
  // object1,
  // keyField,
  // {pid: values.pid, gid: values.gid},
  // context);
  //   stage,
  //   body: {
  //     Object: 'group', Type: 'Query', Keys: { pid: systemItem.pid,
  // sid: keys.sid, gid: toGroupData.root }, IncludeLowerLevels: true,
  //   },
  // });
  return resultData[0];
}
module.exports.addRolesToGroup = addRolesToGroup;

async function migrateRoles(tableName, object1, keyField, values, context) {
  const oldRoles = await queryAllRoles(tableName, object1, keyField, context);
  const oldOutRoles = oldRoles.map((each) => convertItemOut(each, keyField));

  const v1Roles = await context.getRoles();

  let paths = [];

  const rolesOfMigrated = await v1Roles.reduce(async (acc, v1Role) => {
    acc = await acc;

    const hasCreated =
      oldOutRoles.findIndex((each) => each.rid === v1Role.id) >= 0;
    if (hasCreated) {
      return acc;
    }

    const newRole = { ...v1Role };

    newRole.rid = newRole.id;
    delete newRole.id;

    if (!newRole.name) {
      newRole.name = newRole.rid;
    }

    delete newRole.paths;

    const result = await updateRole(
      tableName,
      object1,
      keyField,
      newRole,
      context
    );

    if (v1Role.paths) {
      paths = paths.concat(
        v1Role.paths
          // .filter(
          //   (each) => paths.findIndex((sp) => sp.parent === each.id) < 0
          // )
          .map((each) => ({
            ...each,
            parent: newRole.rid,
          }))
        // .filter(
        //   (each) =>
        //     paths.findIndex(
        //       (sp) => sp.parent === each.parent && sp.id === each.id
        //     ) < 0
        // )
      );
    }

    acc.push(result);
    return acc;
  }, []);

  const len = paths.length;
  for (let idx = 0; idx < len; idx += 1) {
    // try {
    await addMenusToRole(
      tableName,
      object1,
      keyField,
      { [keyField]: paths[idx].parent, menuIds: [paths[idx].id] },
      context
    );
    // } catch (ex) {
    //   console.log(
    //     "thisId:",
    //     paths[idx].id,
    //     "parent:",
    //     paths[idx].parent
    //   );
    //   console.log(
    //     "paths:",
    //     idx,
    //     lastIndex,
    //     len,
    //     JSON.stringify(paths)
    //   );
    //   throw ex;
    // }
  }

  const allRoles = oldOutRoles.concat(
    rolesOfMigrated.map((each) => convertItemOut(each, keyField))
  );

  return {
    totalNumber: v1Roles.length,
    migratedNumber: oldOutRoles.length,
    count: allRoles.length,
    list: allRoles,
  };
}
module.exports.migrateRoles = migrateRoles;

const sensitiveUserProperties = ["password", "secret"];
function removeSensitiveUserData(data) {
  const newData = { ...data };
  sensitiveUserProperties.forEach((key) => {
    delete newData[key];
  });
  return newData;
}
function getSensitiveUserData(data) {
  const newData = {};
  sensitiveUserProperties.forEach((key) => {
    newData[key] = data[key];
  });
  return newData;
}

function generateHash(pw) {
  // Creating a unique salt for a particular user
  const salt = crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations,

  const hash = crypto.pbkdf2Sync(pw, salt, 1000, 64, "sha512").toString("hex");

  return [salt, hash].join(" ");
}

function comparePassword(pw, oldHash) {
  const [salt, hash] = oldHash.split(" ");
  const newHash = crypto
    .pbkdf2Sync(pw, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === newHash;
}

async function updateAuthn(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, isFalsy, makeid, request }
) {
  checkRequired(values, [
    // getKeyField("partner"),
    getKeyField("system"),
    keyField,
  ]);

  const newBody = removeUndefinedKeys({
    sid: values.sid,
    uid: values.uid,
    pid: values.pid,
    ...getSensitiveUserData(values),
  });

  if (!newBody.secret) {
    newBody.secret = makeid(20);
  }

  if (newBody.password) {
    newBody.password = generateHash(newBody.password);
  } else {
    delete newBody.password;
  }

  const valuesToUpdate = convertValuesIn(object1, newBody, keyField);

  if (isFalsy(valuesToUpdate)) {
    return undefined;
  }

  const operations = {};
  operations.secret = "IF_NOT_EXISTS";

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    valuesToUpdate,
    {
      ...getDdbOptions(request),
      operations,
    }
  );
  return result;
}
module.exports.updateAuthn = updateAuthn;

async function cleanUpEmail(tableName, prevEmail, context) {
  const { dynamodb, request } = context;

  // query relations by email
  const relations = await dynamodb.query(
    tableName,
    ...convertKeysToQuery("relation", { email: prevEmail }, ""),
    {
      ...getDdbOptions(request),
    }
  );
  if (relations.length === 0) {
    // delete email by prev email
    await dynamodb.deleteItem(
      tableName,
      convertKeysIn("email", { email: prevEmail }, ""),
      {
        ...getDdbOptions(request),
      }
    );
  } else {
    const emailObj = await dynamodb.getItem(
      tableName,
      convertKeysIn("email", { email: prevEmail }, ""),
      {
        ...getDdbOptions(request),
      }
    );

    const changePrimary =
      relations.filter((rel) => {
        return (
          rel.sid === emailObj.primarySystem && rel.uid === emailObj.primaryUser
        );
      }).length === 0;

    if (changePrimary === true) {
      const firstRel = relations[0];
      // clear primary by old email
      await dynamodb.updateItem(
        tableName,
        convertKeysIn("email", { email: prevEmail }, ""),
        { primarySystem: firstRel.sid, primaryUser: firstRel.uid },
        {
          ...getDdbOptions(request),
        }
      );
    }
  }

  return relations;
}

async function doChangePrimary(tableName, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, ["sid", "uid", "email"]);

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn("email", { email: values.email }, ""),
    { primarySystem: values.sid, primaryUser: values.uid },
    {
      ...getDdbOptions(request),
    }
  );

  return { sid: result.primarySystem, uid: result.primaryUser };
}
module.exports.doChangePrimary = doChangePrimary;

async function doChangePassword(tableName, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, [
    "sid",
    "uid",
    // "currentPassword",
    "newPassword",
    "confirmPassword",
  ]);

  const authnKey = {
    sid: values.sid,
    uid: values.uid,
  };

  const authnItem = await dynamodb.getItem(
    tableName,
    convertKeysIn("authn", authnKey, "uid"),
    {
      ...getDdbOptions(request),
    }
  );
  if (!authnItem) {
    throw new Error("인증정보가 없습니다");
  }

  if (values.currentPassword === undefined) {
    // pass
  } else {
    if (comparePassword(values.currentPassword, authnItem.password)) {
      // pass
    } else {
      throw new Error("현재 비밀번호와 일치하지 않습니다");
    }
  }

  if (!values.newPassword) {
    throw new Error("New Password is required");
  } else if (!values.confirmPassword) {
    throw new Error("Confirm Password is required");
  } else if (values.confirmPassword !== values.newPassword) {
    throw new Error("New passwords are not identical");
  }

  await updateAuthn(
    tableName,
    "authn",
    "uid",
    { ...authnKey, password: values.confirmPassword, passwordIsReset: false },
    context
  );

  return { sid: values.sid, uid: values.uid };
}
module.exports.doChangePassword = doChangePassword;

async function updateEmailRelation(tableName, values, prevEmail, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [getKeyField("system"), "uid"]);

  const newBody = {
    sid: values.sid,
    uid: values.uid,
    email: values.email,
  };

  if (values.email === undefined) {
    return null;
  }

  if (!!prevEmail && !!values.email) {
    if (prevEmail === values.email) {
      // if those are same:
      // break;
      return null;
    }
  } else if (!prevEmail && !values.email) {
    return null;
  } else if (prevEmail && !values.email) {
    // delete prev relation by prev email
    console.log("{ ...newBody, email: prevEmail }:", {
      ...newBody,
      email: prevEmail,
    });
    await dynamodb.deleteItem(
      tableName,
      convertKeysIn("relation", { ...newBody, email: prevEmail }, ""),
      {
        ...getDdbOptions(request),
      }
    );

    await cleanUpEmail(tableName, prevEmail, context);

    return null;
  }

  // get relation by new email
  const newRelation = await dynamodb.getItem(
    tableName,
    convertKeysIn("relation", newBody, ""),
    {
      ...getDdbOptions(request),
    }
  );

  // if new relation exists:
  if (newRelation) {
    // delete new relation by new email
    await dynamodb.deleteItem(
      tableName,
      convertKeysIn("relation", newBody, ""),
      {
        ...getDdbOptions(request),
      }
    );
  }

  // if prev email does not exist:
  if (!prevEmail) {
    // insert new relation with initial values
    const result = await dynamodb.insertItem(
      tableName,
      convertKeysIn("relation", newBody, ""),
      convertValuesIn("relation", newBody, ""),
      {
        ...getDdbOptions(request),
      }
    );

    // insert/update email by new email
    await dynamodb.updateItem(
      tableName,
      convertKeysIn("email", { email: newBody.email }, ""),
      { primarySystem: newBody.sid, primaryUser: newBody.uid },
      {
        ...getDdbOptions(request),
        operations: {
          primarySystem: "IF_NOT_EXISTS",
          primaryUser: "IF_NOT_EXISTS",
        },
      }
    );

    return result;
  }

  // if prev email exists:
  else if (prevEmail) {
    // get prev relation by prev email
    const prevRelation = await dynamodb.getItem(
      tableName,
      convertKeysIn("relation", { ...newBody, email: prevEmail }, ""),
      {
        ...getDdbOptions(request),
      }
    );
    const outPrevRelation = convertItemOut(prevRelation, "");

    // insert new relation with prev relation data
    const result = await dynamodb.insertItem(
      tableName,
      convertKeysIn("relation", newBody, ""),
      convertValuesIn("relation", { ...outPrevRelation, ...newBody }, ""),
      {
        ...getDdbOptions(request),
      }
    );

    // insert/update email by new email
    await dynamodb.updateItem(
      tableName,
      convertKeysIn("email", { email: newBody.email }, ""),
      { primarySystem: newBody.sid, primaryUser: newBody.uid },
      {
        ...getDdbOptions(request),
        operations: {
          primarySystem: "IF_NOT_EXISTS",
          primaryUser: "IF_NOT_EXISTS",
        },
      }
    );

    // delete prev relation by prev email
    await dynamodb.deleteItem(
      tableName,
      convertKeysIn("relation", { ...newBody, email: prevEmail }, ""),
      {
        ...getDdbOptions(request),
      }
    );

    await cleanUpEmail(tableName, prevEmail, context);

    return result;
  }
}

async function signInByEmail(tableName, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, ["email", "password"]);

  const emailItem = await dynamodb.getItem(
    tableName,
    convertKeysIn("email", { email: values.email }, ""),
    {
      ...getDdbOptions(request),
    }
  );

  if (!emailItem) {
    return {
      errorMessage: "이메일이 회원 정보에 없습니다",
    };
  }

  return signInAsV1(
    tableName,
    {
      sid: emailItem.primarySystem,
      uid: emailItem.primaryUser,
      password: values.password,
    },
    context
  );
}
module.exports.signInByEmail = signInByEmail;

async function doRegisterAppToken(tableName, values, context) {
  const { dynamodb, dayjs, request } = context;

  checkRequired(values, ["token"]);

  if (values.sid || values.uid || values.pid) {
    checkRequired(values, ["sid", "uid", "pid"]);
  }

  const newKeysIn = convertKeysIn("apptoken", values, "");
  const newValuesIn = convertValuesIn("apptoken", values, "");
  if (!newValuesIn.history) {
    newValuesIn.history = [];
  }
  newValuesIn.userAgent = request.headers["User-Agent"];
  newValuesIn.sourceIp = request.sourceIP;

  //  get item by appToken;
  const tokenItem = await dynamodb.getItem(tableName, newKeysIn, {
    ...getDdbOptions(request),
  });

  let result;

  //  if exists:
  if (tokenItem) {
    //    if different with values.sid, values.uid (aka sk2)
    if (tokenItem.sk2 !== newValuesIn.sk2) {
      //      history.push(current pk2,sk2,replacedAt:now())
      newValuesIn.history.push({
        pk2: tokenItem.pk2,
        sk2: tokenItem.sk2,
        replacedAt: dayjs.utc().format(),
      });
      //      update_item( with new pk2: values.pid, sk2 );
    } else {
      delete newValuesIn.history;
    }

    result = await dynamodb.updateItem(tableName, newKeysIn, newValuesIn, {
      ...getDdbOptions(request),
    });

    // return result;
  } else {
    //   insert_item()
    result = await dynamodb.insertItem(tableName, newKeysIn, newValuesIn, {
      ...getDdbOptions(request),
    });
    // return result;
  }

  if (values.oldToken && values.oldToken !== values.token) {
    await doDeleteAppTokens(tableName, { tokens: [values.oldToken] }, context);
  }

  return result;
}
module.exports.doRegisterAppToken = doRegisterAppToken;

async function doDeleteAppTokens(tableName, values, context) {
  const { dynamodb, request, isArray } = context;

  checkRequired(values, ["tokens"]);

  if (!isArray(values.tokens)) {
    throw new Error("tokens must be array type");
  }

  if (values.tokens.length === 0) {
    return { count: 0 };
  }

  await Promise.all(
    values.tokens.map((token) => {
      const newKeysIn = convertKeysIn("apptoken", { token }, "");
      return dynamodb.deleteItem(tableName, newKeysIn, {
        ...getDdbOptions(request),
      });
    })
  );

  return { count: values.tokens.length };
}
module.exports.doDeleteAppTokens = doDeleteAppTokens;

async function queryAppTokensByUser(tableName, values, context) {
  const { dynamodb, request } = context;

  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery("apptoken", values, ""),
    {
      ...getDdbOptions(request),
      indexName: "pkid-sk2-index",
    }
  );

  return result;
}
module.exports.queryAppTokensByUser = queryAppTokensByUser;

async function queryNotificationsByUser(tableName, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, ["uid", "sid"]);

  const newValues = {
    ...values,
  };

  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery("notification", newValues, ""),
    {
      ...getDdbOptions(request),
      indexName: "pkid-sk2-index",
    }
  );

  return result;
}
module.exports.queryNotificationsByUser = queryNotificationsByUser;

async function saveNotification(tableName, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, ["uuid", "pid", "sid", "uid"]);

  // const newKeysIn = convertKeysIn("notification", values, "");

  const result = await dynamodb.updateItem(
    tableName,
    { pkid: "notification", skid: values.uuid },
    convertValuesIn("notification", { ...values, unread: true }),
    {
      ...getDdbOptions(request),
    }
  );

  await dynamodb.updateItem(
    tableName,
    convertKeysIn("user", values, "uid"),
    { unreads: [result.uuid] },
    {
      ...getDdbOptions(request),
      operations: {
        unreads: "ADD",
      },
      sets: {
        unreads: "string",
      },
    }
  );

  return result;
}
module.exports.saveNotification = saveNotification;

async function doSetReadNotification(tableName, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, ["uuid", "sid", "uid"]);

  // const newKeysIn = convertKeysIn("notification", values, "");

  const result = await dynamodb.updateItem(
    tableName,
    { pkid: "notification", skid: values.uuid },
    convertValuesIn("notification", { ...values, unread: false }),
    {
      ...getDdbOptions(request),
    }
  );

  await dynamodb.updateItem(
    tableName,
    convertKeysIn("user", values, "uid"),
    { unreads: [result.uuid] },
    {
      ...getDdbOptions(request),
      operations: {
        unreads: "SUB",
      },
      sets: {
        unreads: "string",
      },
    }
  );

  return result;
}
module.exports.doSetReadNotification = doSetReadNotification;

async function signInAsV1(tableName, values, context) {
  const { dynamodb, makeid, dayjs, request } = context;

  checkRequired(values, ["sid", "uid", "password"]);

  const authnKey = {
    sid: values.sid,
    uid: values.uid,
  };

  const user = await queryUserById(
    tableName,
    "user",
    "uid",
    {
      ...authnKey,
      // excludeRelations: true,
    },
    context
  );
  if (user.blocked === true) {
    return {
      errorMessage: "현재 사용자는 접속이 차단되었습니다",
    };
  }

  let authnItem = await dynamodb.getItem(
    tableName,
    convertKeysIn("authn", authnKey, "uid"),
    {
      ...getDdbOptions(request),
    }
  );
  if (!authnItem) {
    return {
      errorMessage: "인증정보가 없습니다",
    };
  }

  if (comparePassword(values.password, authnItem.password)) {
    // pass
  } else {
    return {
      errorMessage: "비밀번호가 정확하지 않습니다",
    };
  }

  let secret = authnItem.secret;
  if (!authnItem.secret) {
    const newAuthn = {
      ...authnKey,
      secret: makeid(32),
    };
    authnItem = await updateAuthn(tableName, "authn", "uid", newAuthn, context);
    secret = newAuthn.secret;
  }

  const sessionId = makeid(32);
  const sesData = {
    userId: authnKey.uid,
    systemId: authnKey.sid,
    partnerId: authnItem.pid,
    signInAt: dayjs().utc().format(),
    // expiresAt,
    // expiresIn,
  };

  await dynamodb.updateItem(
    tableName,
    convertKeysIn("user", { sid: values.sid, uid: values.uid }, "uid"),
    {
      lastSignInAt: sesData.signInAt,
    },
    {
      ...getDdbOptions(request),
    }
  );

  await dynamodb.updateItem(
    tableName,
    convertKeysIn("session", { uuid: sessionId }, ""),
    sesData,
    {
      ...getDdbOptions(request),
    }
  );

  const token = jwt.sign(
    { sid: authnKey.sid, pid: authnItem.pid, uid: authnKey.uid },
    secret,
    { expiresIn: "12h" }
  );
  const cookieString = cookie.serialize("_bsgsupport_jwt", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  const outUser = convertItemOut(user, "uid");

  const system = await querySystemById(
    tableName,
    "system",
    "sid",
    {
      sid: outUser.sid,
    },
    context
  );

  const partner = await queryPartnerById(
    tableName,
    "partner",
    "pid",
    {
      pid: outUser.pid,
    },
    context
  );

  const gidSet = new Set();
  user.relations.forEach((rel) => {
    gidSet.add(rel.gid);
  });
  const groupPromises = Array.from(gidSet).map((gid) =>
    queryGroupById(
      tableName,
      "group",
      "gid",
      {
        sid: outUser.sid,
        gid: gid,
      },
      context
    )
  );
  const groups = await Promise.all(groupPromises);

  // let rolesmenus;

  return {
    headers: {
      "Set-Cookie": cookieString,
    },
    body: {
      result: {
        ...outUser,
        session: sessionId,
        groups: groups.flat(),
        system: convertItemOut(system, "sid"),
        partner: convertItemOut(partner, "pid"),
      },
    },
  };
}
module.exports.signInAsV1 = signInAsV1;

function makeSubPaths(children, menuObjects) {
  return children
    ? children.map((mid) => ({
        id: mid,
        subPaths: menuObjects[mid]
          ? makeSubPaths(menuObjects[mid].children, menuObjects)
          : undefined,
      }))
    : undefined;
}

async function queryRolesAndMenusForUser(tableName, values, context) {
  const user = await queryUserById(
    tableName,
    "user",
    "uid",
    {
      sid: values.sid,
      uid: values.uid,
      excludeRelations: true,
    },
    context
  );
  const outUser = convertItemOut(user, "uid");

  const { isFalsy } = context;
  if (isFalsy(outUser.roles)) {
    return {};
  }

  const roleList = await queryRoleByIdList(
    tableName,
    "role",
    "rid",
    outUser.roles.map((each) => each.id || each),
    context
  );
  const midSet = new Set();

  const roles = roleList
    .map((each) => convertItemOut(each, "rid"))
    .map((each) => {
      const newEach = { ...each };
      delete newEach.menus;
      delete newEach.rid;

      newEach.paths = each.menus.map((mid) => {
        midSet.add(mid);
        return { id: mid };
      });
      newEach.id = each.rid;

      return newEach;
    });

  const subMenuList = [];
  const allMenuObjects = {};

  const menusResult = await Promise.all(
    Array.from(midSet).map(async (mid) => {
      console.log("mid:", mid);
      const menuList = await queryMenuById(
        tableName,
        "menu",
        "mid",
        { mid, IncludeLowerLevels: true },
        context
      );
      const outMenuList = menuList.map((each) => {
        const newEach = {
          children: each.children,
          ...convertItemOut(each, "mid"),
        };
        allMenuObjects[newEach.mid] = newEach;
        return newEach;
      });
      // .map((each) => {
      //   const newEach = { ...each };

      //   newEach.subPaths = each.children
      //     ? each.children.map((mid) => ({ id: mid }))
      //     : [];

      //   return newEach;
      // });
      console.log("outMenuList:", JSON.stringify(outMenuList));
      const topMenu = outMenuList.find((each) => each.mid === mid);
      subMenuList.push(...outMenuList.filter((each) => each.mid !== mid));
      return topMenu;
    })
  );

  return {
    // dispatch(storePathsForCurrentUser(paths, roles, subPathCollection));
    paths: menusResult.filter(Boolean).map((each) => {
      const newEach = { ...each };

      delete newEach.mid;
      newEach.id = each.mid;

      delete newEach.children;
      newEach.subPaths = makeSubPaths(each.children, allMenuObjects);
      return newEach;
    }),
    roles,
    subPathCollection: subMenuList.map((each) => {
      const newEach = { ...each };

      delete newEach.mid;
      newEach.id = each.mid;

      return newEach;
    }),
  };
}
module.exports.queryRolesAndMenusForUser = queryRolesAndMenusForUser;

async function getSession(tableName, values, context) {
  const { dynamodb, request } = context;

  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn("session", { uuid: values.id }, ""),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.getSession = getSession;

async function verifyJwt(request, tableName, context) {
  const { dynamodb } = context;

  if (!request.headers.Cookie) {
    return {
      authenticated: true,
      noCookie: true,
    };
  }

  // check jwt from cookie
  const cookieObj = cookie.parse(request.headers.Cookie);
  // console.log("cookieObj:", cookieObj);
  if (cookieObj._bsgsupport_jwt) {
    // console.log("cookieObj._bsgsupport_jwt:", cookieObj._bsgsupport_jwt);
    const authnKey = {
      sid: request.systemId,
      uid: request.userId,
    };

    const authnItem = await dynamodb.getItem(
      tableName,
      convertKeysIn("authn", authnKey, "uid"),
      {
        ...getDdbOptions(request),
      }
    );
    // console.log("authnItem:", authnItem);
    if (!authnItem) {
      return {
        authenticated: false,
        errorMessage: "인증정보가 없습니다",
      };
    }
    if (!authnItem.secret) {
      return {
        authenticated: false,
        errorMessage: "매칭되는 인증정보가 없습니다",
      };
    }

    try {
      // const payload =
      jwt.verify(cookieObj._bsgsupport_jwt, authnItem.secret);
      // console.log("payload:", payload);
      return {
        authenticated: true,
      };
    } catch (ex) {
      if (ex.name === "TokenExpiredError") {
        return {
          authenticated: false,
          errorMessage: "인증정보가 유효기간이 지났습니다",
          errorDescription: ex.message,
        };
      }
      return {
        authenticated: false,
        errorMessage: "인증정보가 정확하지 않습니다",
        errorDescription: ex.message,
      };
    }
  } else {
    return {
      authenticated: true,
      noJwt: true,
    };
  }
}
module.exports.verifyJwt = verifyJwt;

async function createUser(tableName, object1, keyField, values, context) {
  const { dynamodb, request, isTruthy, isObject } = context;

  checkRequired(values, [
    getKeyField("partner"),
    getKeyField("system"),
    keyField,
    "name",
  ]);

  const invalid = /[^a-z0-9._@-]/g.test(values[keyField]);
  if (invalid) {
    throw new Error(
      [
        'Use only lower letters, numbers, "@", ".", hyphens,',
        "or underscores with no spaces for ID",
      ].join(" ")
    );
  }

  // get prev email
  const user = await queryUserById(
    tableName,
    "user",
    "uid",
    {
      sid: values.sid,
      uid: values.uid,
      excludeRelations: true,
    },
    context
  );
  const prevEmail = user && user.email;

  const newBody = removeSensitiveUserData({
    ...values,
  });

  const sets = {};
  if (isTruthy(newBody.roles)) {
    sets.roles = "string";
  } else {
    delete newBody.roles;
  }

  delete newBody.primary;
  delete newBody.referrer;

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
      sets,
    }
  );

  if (result.pkid) {
    await updateAuthn(tableName, "authn", keyField, values, context);
    await updateEmailRelation(
      tableName,
      {
        sid: values.sid,
        uid: values.uid,
        email: values.email,
      },
      prevEmail,
      context
    );
    if (isTruthy(result.roles)) {
      await addRolesToUser(
        tableName,
        object1,
        keyField,
        {
          sid: values.sid,
          uid: values.uid,
          roleIds: result.roles.map((each) =>
            isObject(each) ? each.id : each
          ),
        },
        context
      );
    }

    result.primary = await getPrimaryByEmail(
      tableName,
      { email: result.email },
      context
    );
  }

  return result;
}
module.exports.createUser = createUser;

async function updateUser(tableName, object1, keyField, values, context) {
  const { dynamodb, request, isTruthy, isObject } = context;

  checkRequired(values, [keyField, getKeyField("system")]);

  // get prev email
  const user = await queryUserById(
    tableName,
    "user",
    "uid",
    {
      sid: values.sid,
      uid: values.uid,
      excludeRelations: true,
    },
    context
  );
  const prevEmail = user && user.email;

  const newBody = removeSensitiveUserData({
    ...values,
  });
  delete newBody.primary;
  delete newBody.unreads;

  const sets = {};
  if (isTruthy(newBody.roles)) {
    sets.roles = "string";
  } else {
    delete newBody.roles;
  }

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
      sets,
    }
  );

  if (result.pkid) {
    await updateAuthn(
      tableName,
      "authn",
      keyField,
      { pid: result.pid, ...values },
      context
    );
    await updateEmailRelation(
      tableName,
      {
        sid: values.sid,
        uid: values.uid,
        email: values.email,
      },
      prevEmail,
      context
    );

    if (isTruthy(result.roles)) {
      await addRolesToUser(
        tableName,
        object1,
        keyField,
        {
          sid: values.sid,
          uid: values.uid,
          roleIds: result.roles.map((each) =>
            isObject(each) ? each.id : each
          ),
        },
        context
      );
    }

    result.primary = await getPrimaryByEmail(
      tableName,
      { email: result.email },
      context
    );
  }

  return result;
}
module.exports.updateUser = updateUser;

async function queryRelationsByUser(tableName, values, context) {
  const { dynamodb, request } = context;

  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery("relation", values, ""),
    {
      ...getDdbOptions(request),
      indexName: "pkid-sk2-index",
    }
  );

  return result;
}
module.exports.queryRelationsByUser = queryRelationsByUser;

async function getPrimaryByEmail(tableName, values, context) {
  const { dynamodb, request } = context;

  if (!values.email) {
    return undefined;
  }

  const relations = await dynamodb.query(
    tableName,
    ...convertKeysToQuery("relation", { email: values.email }, ""),
    {
      ...getDdbOptions(request),
    }
  );

  const emailObj = await dynamodb.getItem(
    tableName,
    convertKeysIn("email", { email: values.email }, ""),
    {
      ...getDdbOptions(request),
    }
  );
  const sidSet = new Set();
  relations.forEach((rel) => {
    sidSet.add(rel.sid);
  });
  const systems = await dynamodb.batchGetItem(
    tableName,
    Array.from(sidSet).map((sid) => convertKeysIn("system", { sid }, "sid")),
    {
      ...getDdbOptions(request),
    }
  );
  return {
    sid: emailObj.primarySystem,
    uid: emailObj.primaryUser,
    list: relations,
    systems: systems.reduce((acc, sys) => {
      acc[sys.sid] = sys;
      return acc;
    }, {}),
  };
}

async function queryUserById(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;

  checkRequired(values, [
    keyField,
    // getKeyField("partner"),
    getKeyField("system"),
  ]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (result) {
    if (values.excludeRelations === true) {
      result.relations = [];
    } else {
      checkRequired(values, [getKeyField("system")]);
      const relations = await queryRelationsByUser(
        tableName,
        {
          sid: values.sid,
          uid: convertItemOut(result, keyField)[keyField],
        },
        context
      );
      result.relations = relations.map((each) => convertItemOut(each, ""));
    }
    if (values.includePrimary === true) {
      result.primary = await getPrimaryByEmail(
        tableName,
        { email: result.email },
        context
      );
    }
  }

  return result;
}
module.exports.queryUserById = queryUserById;

async function queryUserSiblings(
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, isArray, request } = context;

  checkRequired(values, [
    keyField,
    // getKeyField("partner"),
    getKeyField("system"),
  ]);

  let outRelations;

  const uidSet = new Set();
  const usersList = [];

  const newBody = {
    ...values,
  };

  const thisUser = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  const outThisUser = convertItemOut(thisUser, "uid");

  if (values.gid) {
    const relation = await dynamodb.getItem(
      tableName,
      convertKeysIn("relation", newBody, ""),
      {
        ...getDdbOptions(request),
      }
    );
    if (relation) {
      outRelations = [convertItemOut(relation, "")];
    } else {
      return [outThisUser];
    }
  } else {
    const relations = await dynamodb.query(
      tableName,
      ...convertKeysToQuery(
        "relation",
        {
          sid: values.sid,
          uid: outThisUser.uid,
        },
        ""
      ),
      {
        ...getDdbOptions(request),
        indexName: "pkid-sk2-index",
      }
    );

    let hasGroups = false;
    if (isArray(relations) && relations.length > 0) {
      hasGroups = true;
    }

    if (hasGroups === false) {
      return [outThisUser];
    }

    outRelations = relations.map((each) => convertItemOut(each, ""));
  }

  for (const rel of outRelations) {
    const { gid, isLeader } = rel;
    const groupData = await queryGroupById(
      tableName,
      "group",
      "gid",
      {
        sid: values.sid,
        gid,
        IncludeLowerLevels: !!(values.includeLowerForLeader && isLeader),
        IncludeHigherLevels: false,
        IncludeUsers: true,
      },
      context
    );
    if (groupData.length > 0) {
      for (const group of groupData) {
        // console.log("group.users:", group.users);
        for (const user of group.users) {
          if (!uidSet.has(user.uid)) {
            usersList.push(user);
            uidSet.add(user.uid);
          }
        }
      }
    }
  }

  return usersList;
}
module.exports.queryUserSiblings = queryUserSiblings;

async function queryUsersBySearch(
  tableName,
  object1,
  keyField,
  values,
  context
) {
  const { dynamodb, request } = context;

  const newBody = {
    ...values,
    sid: request.systemId,
  };

  const filters = {};
  if (newBody.name) {
    filters.lowerName = {
      operation: "contains",
      value: newBody.name.toLowerCase(),
    };
  }
  if (newBody.tag) {
    filters.tag = {
      operation: "contains",
      value: newBody.tag,
    };
  }

  if (newBody.uid) {
    /*
      getItem에는 filters를 적용할수 없으므로 사용하지 않고 
      아래 query결과에서 exactUser를 찾아 검색결과의 상단으로 이동한다.
    */
    // exactUser = await dynamodb.getItem(
    //   tableName,
    //   convertKeysIn(
    //     object1,
    //     {
    //       sid: newBody.sid,
    //       uid: newBody.uid,
    //     },
    //     keyField
    //   ),
    //   {
    //     ...getDdbOptions(request),
    //   }
    // );

    filters.uid = {
      operation: "contains",
      value: newBody.uid,
    };
  }

  const users = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(
      object1,
      {
        sid: newBody.sid,
      },
      keyField
    ),
    {
      ...getDdbOptions(request),
      filters,
    }
  );

  // let exactUser;

  // return exactUser
  //   ? [exactUser].concat(users.filter((each) => each.uid !== exactUser.uid))
  //   : users;
  if (newBody.uid) {
    // https://stackoverflow.com/a/23921775
    const sorterMovingExactToFirst = function (x, y) {
      return x.uid === newBody.uid ? -1 : y.uid === newBody.uid ? 1 : 0;
    };
    users.sort(sorterMovingExactToFirst);
  }
  return users;
}
module.exports.queryUsersBySearch = queryUsersBySearch;

// async function queryUserLowerLevels(
//   tableName,
//   object1,
//   keyField,
//   values,
//   context
// ) {
//   const { dynamodb, isArray } = context;

//   checkRequired(values, [
//     keyField,
//     getKeyField("partner"),
//     getKeyField("system"),
//   ]);

//   const newBody = {
//     ...values,
//   };
//   const result = await dynamodb.getItem(
//     tableName,
//     convertKeysIn(object1, newBody, keyField),
//     {
//       ...getDdbOptions(request),
//     }
//   );
//   const outResult = convertItemOut(result, "uid");

//   const relations = await dynamodb.query(
//       tableName,
//       ...convertKeysToQuery(
//         "relation",
//         {
//           pid: values.pid,
//           sid: values.sid,
//           uid: outResult.uid,
//         },
//         ""
//       ),
//       {
//         ...getDdbOptions(request),
//       }
//     );

//   let hasGroups = false;
//   if (isArray(relations) && relations.length > 0) {
//     hasGroups = true;
//   }

//   if (hasGroups === false) {
//     return [];
//   }

//   const uidSet = new Set();
//   const usersList = [];

// const groups = relations.map(each => convertItemOut(each, "").gid);
//   for (const gid of groups) {
//     const groupData = await queryGroupById(
//       tableName,
//       "group",
//       "gid",
//       {
//         pid: values.pid,
//         sid: values.sid,
//         gid,
//         IncludeLowerLevels: true,
//         IncludeHigherLevels: false,
//         IncludeUsers: true,
//       },
//       context
//     );
//     if (groupData.length > 0) {
//       for (const group of groupData) {
//         for (const user of group.users) {
//           if (!uidSet.has(user.uid)) {
//             usersList.push(user);
//             uidSet.add(user.uid);
//           }
//         }
//       }
//     }
//   }

//   return usersList;
// }
// module.exports.queryUserLowerLevels = queryUserLowerLevels;

async function queryUsersBySystemId(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, isTruthy, request }
) {
  checkRequired(values, [getKeyField("system")]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
  };
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      // indexName: "pk2-skid-index",
      ...getDdbOptions(request),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryUsersBySystemId = queryUsersBySystemId;

async function migrateUsers(tableName, object1, keyField, values, context) {
  const oldUsers = await queryUsersBySystemId(
    tableName,
    object1,
    keyField,
    values,
    context
  );
  const oldOutUsers = oldUsers.map((each) => convertItemOut(each, keyField));

  const v1Users = await context.getUsers({ pid: values.pid, sid: values.sid });

  const usersOfMigrated = await v1Users.reduce(async (acc, v1User) => {
    acc = await acc;

    const hasCreated =
      oldOutUsers.findIndex((each) => each.uid === v1User.id) >= 0;
    if (hasCreated) {
      return acc;
    }

    const newUser = { ...v1User };
    newUser.pid = newUser.partnerID;
    newUser.sid = newUser.systemID;
    delete newUser.partnerID;
    delete newUser.systemID;

    newUser.uid = newUser.id;
    delete newUser.id;

    delete newUser.users; // 기존 v1에 이상하게 users속성에 role데이터가 있음.

    if (!newUser.name) {
      newUser.name = newUser.uid;
    }

    // const roles = newUser.roles;
    // delete newUser.roles;

    const result = await createUser(
      tableName,
      object1,
      keyField,
      newUser,
      context
    );

    // if (roles) {
    //   result = await addRolesToUser(
    //     tableName,
    //     object1,
    //     keyField,
    //     {
    //       pid: newUser.pid,
    //       sid: newUser.sid,
    //       [keyField]: newUser[keyField],
    //       roleIds: roles.map((role) => role.id),
    //     },
    //     context
    //   );
    // }

    acc.push(result);
    return acc;
  }, []);

  const allUsers = oldOutUsers.concat(
    usersOfMigrated.map((each) => convertItemOut(each, keyField))
  );
  return {
    totalNumber: v1Users.length,
    migratedNumber: oldOutUsers.length,
    count: allUsers.length,
    list: allUsers,
  };
}
module.exports.migrateUsers = migrateUsers;

async function addRolesToUser(tableName, object1, keyField, values, context) {
  const { dynamodb, request, isObject, isTruthy } = context;
  checkRequired(values, [keyField, "roleIds", "sid"]);

  // const sysAttrName = ["sys", values.sid].join("-");

  // const groupTableName = getTableName("group", stage);
  // const groupKeyField = getKeyField("group")[0];

  const oldUser = await queryUserById(
    tableName,
    object1,
    keyField,
    {
      // pid: values.pid,
      sid: values.sid,
      [keyField]: values[keyField],
    },
    context
  );
  const oldRoles =
    // [
    //   "te3yk4x3yz",
    //   "c2cw9pl6xu",
    //   "cvdr7k74l3",
    //   "1w7jmdtpj1",
    //   "i8ii1mx2gj",
    //   "jw7eflsssc",
    // ] ||
    (oldUser.roles || [])
      .map((each) => (isObject(each) ? each.id : null))
      .filter(Boolean);
  if (isTruthy(oldRoles)) {
    await dynamodb.updateItem(
      tableName,
      convertKeysIn(
        object1,
        {
          // pid: values.pid,
          sid: values.sid,
          [keyField]: values[keyField],
        },
        keyField
      ),
      { name: oldUser.name, roles: ["df"] },
      {
        ...getDdbOptions(request),
        operations: {
          roles: "REMOVE",
        },
      }
    );
  }
  const roleSet = new Set();
  values.roleIds.forEach((rid) => {
    roleSet.add(rid);
  });
  oldRoles.forEach((rid) => {
    roleSet.add(rid);
  });
  const newRoles = Array.from(roleSet);

  const tItems = [
    // add user to roles
    ...newRoles.map((eachRid) => ({
      tableName,
      type: "Update",
      keys: convertKeysIn(
        "relation",
        { sid: values.sid, [keyField]: values[keyField], rid: eachRid },
        ""
      ),
      values: convertValuesIn(
        "relation",
        {
          sid: values.sid,
          rid: eachRid,
          [keyField]: values[keyField],
        },
        ""
      ),
      options: {
        // operations: {
        //   [sysAttrName]: "ADD",
        // },
        // sets: {
        //   [sysAttrName]: "string",
        // },
      },
    })),

    // add roles to user
    {
      tableName,
      type: "Update",
      keys: convertKeysIn(
        object1,
        {
          // pid: values.pid,
          sid: values.sid,
          [keyField]: values[keyField],
        },
        keyField
      ),
      values: {
        roles: newRoles,
      },
      options: {
        operations: {
          roles: "ADD",
        },
        sets: { roles: "string" },
      },
    },
  ];
  console.log("tItems:", JSON.stringify(tItems));

  await dynamodb.transaction(tItems, {
    ...getDdbOptions(request),
  });

  const resultData = await queryUserById(
    tableName,
    object1,
    keyField,
    {
      // pid: values.pid,
      sid: values.sid,
      [keyField]: values[keyField],
    },
    context
  );

  // const result = await queryGroupById(tableName,
  // object1,
  // keyField,
  // {pid: values.pid, gid: values.gid},
  // context);
  //   stage,
  //   body: {
  //     Object: 'group', Type: 'Query', Keys: { pid: systemItem.pid,
  // sid: keys.sid, gid: toGroupData.root }, IncludeLowerLevels: true,
  //   },
  // });
  return resultData;
}
module.exports.addRolesToUser = addRolesToUser;

async function createRole(tableName, object1, keyField, values, context) {
  const { dynamodb, makeid, isTruthy, request } = context;
  checkRequired(values, ["name"]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
    [keyField]: makeid(8),
  };

  delete newBody.menus; // addRolesToPartner로 role 추가.

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (isTruthy(values.menus)) {
    await addMenusToRole(
      tableName,
      object1,
      keyField,
      { rid: newBody.rid, menuIds: values.menus },
      context
    );
  }

  return result;
}
module.exports.createRole = createRole;

async function updateRole(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request, isTruthy }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };

  const sets = {};

  if (isTruthy(newBody.menus)) {
    sets.menus = "string";
  }

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
      sets,
    }
  );
  return result;
}
module.exports.updateRole = updateRole;

async function queryRoleById(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.queryRoleById = queryRoleById;

async function queryRoleByIdList(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, isArray, request, isFalsy }
) {
  if (!isArray(values)) {
    throw new Error("values must be array type");
  }

  // const result = await dynamodb.getItem(
  //   tableName,
  //   convertKeysIn(object1, newBody, keyField),
  //   {
  //     ...getDdbOptions(request),
  //   }
  // );
  if (isFalsy(values)) {
    return [];
  }

  const result = await dynamodb.batchGetItem(
    tableName,
    values.map((eachRid) => convertKeysIn(object1, { rid: eachRid }, keyField)),
    { ...getDdbOptions(request) }
  );

  return result;
}
module.exports.queryRoleByIdList = queryRoleByIdList;

async function queryAllRoles(
  tableName,
  object1,
  keyField,
  { dynamodb, request }
) {
  const newBody = {};
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryAllRoles = queryAllRoles;

async function addMenusToRole(tableName, object1, keyField, values, context) {
  const { dynamodb, request } = context;
  checkRequired(values, [keyField, "menuIds"]);

  // const groupTableName = getTableName("group", stage);
  // const groupKeyField = getKeyField("group")[0];

  await dynamodb.transaction(
    [
      // add role to menu.roles
      ...values.menuIds.map((eachMid) => ({
        tableName,
        type: "Update",
        keys: convertKeysIn("menu", { mid: eachMid }, getKeyField("menu")),
        values: {
          roles: [values[keyField]],
        },
        options: {
          operations: {
            roles: values.opposite === true ? "SUB" : "ADD",
          },
          sets: { roles: "string" },
        },
      })),

      // add menus to role.menus
      {
        tableName,
        type: "Update",
        keys: convertKeysIn(
          object1,
          {
            [keyField]: values[keyField],
          },
          keyField
        ),
        values: {
          menus: values.menuIds,
        },
        options: {
          operations: {
            menus: values.opposite === true ? "SUB" : "ADD",
          },
          sets: {
            menus: "string",
          },
        },
      },
    ],
    {
      ...getDdbOptions(request),
    }
  );

  const resultData = await queryRoleById(
    tableName,
    object1,
    keyField,
    {
      [keyField]: values[keyField],
    },
    context
  );

  return resultData;
}
module.exports.addMenusToRole = addMenusToRole;

async function createMenu(
  tableName,
  object1,
  keyField,
  values,
  context,
  to,
  targetRoot
) {
  const { dynamodb, makeid, isTruthy, request } = context;

  checkRequired(values, ["name"]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
    [keyField]: makeid(8),
  };
  if (values.isFolder === true) {
    newBody[keyField] = "F-".concat(newBody[keyField]);
  }

  // delete newBody.isFolder;

  // if (to) {
  //   newBody.isSub = true;
  // }

  let result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  if (result && to && targetRoot) {
    result = await assignItem(newBody, to, targetRoot, {
      tableName,
      object: object1,
      keyField,
      context,
    });
  }

  return result;
}
module.exports.createMenu = createMenu;

async function updateMenu(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField]);

  const newBody = {
    ...values,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.updateMenu = updateMenu;

// async function queryMenuById(
//   tableName,
//   object1,
//   keyField,
//   values,
//   { dynamodb, request }
// ) {
//   checkRequired(values, [keyField]);

//   const newBody = {
//     ...values,
//   };
//   const result = await dynamodb.getItem(
//     tableName,
//     convertKeysIn(object1, newBody, keyField),
//     {
//       ...getDdbOptions(request),
//     }
//   );

//   return result;
// }
// module.exports.queryMenuById = queryMenuById;

async function queryAllMenus(
  tableName,
  object1,
  keyField,
  { dynamodb, request }
) {
  const newBody = {};
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
      filters: {
        isFolder: {
          operation: "<>",
          value: true,
        },
      },
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryAllMenus = queryAllMenus;

async function migrateMenu(tableName, object1, keyField, values, context) {
  const oldMenus = await queryAllMenus(tableName, object1, keyField, context);
  const oldOutMenus = oldMenus.map((each) => convertItemOut(each, keyField));

  const v1Menus = await context.getMenus();

  let subPaths = [];

  const menusOfMigrated = await v1Menus
    // .filter((each) =>
    //   [
    //     "3ok3oo86gj",
    //     "8fmvp6i07i",
    //     "ilgk4fn6ou",
    //     "x9soqt1wtp",
    //     "1nnfwf0cz8",
    //     "m5a9edo424",
    //     "hx2forv1hi",
    //   ].includes(each.id)
    // )
    .reduce(async (acc, v1Menu) => {
      acc = await acc;

      const hasCreated =
        oldOutMenus.findIndex((each) => each.mid === v1Menu.id) >= 0;
      if (hasCreated) {
        return acc;
      }

      const newMenu = { ...v1Menu };

      newMenu.mid = newMenu.id;
      delete newMenu.id;

      if (!newMenu.name) {
        newMenu.name = newMenu.mid;
      }

      delete newMenu.subPaths;

      const result = await updateMenu(
        tableName,
        object1,
        keyField,
        newMenu,
        context
      );

      if (v1Menu.subPaths) {
        subPaths = await getSubPaths(
          subPaths,
          v1Menu.subPaths,
          v1Menu.id,
          v1Menu.id,
          tableName,
          object1,
          keyField,
          context
        );
      }

      acc.push(result);
      return acc;
    }, []);

  console.log("subPaths:", JSON.stringify(subPaths));

  for (let idx2 = 0; idx2 < 2; idx2 += 1) {
    // let lastIndex = 0;
    // let cnt = 0;
    // while (subPaths.length > lastIndex) {
    //   cnt += 1;
    //   if (cnt > 10000) {
    //     break;
    //   }
    const len = subPaths.length;
    // for (let idx = lastIndex; idx < len; idx += 1) {
    for (let idx = 0; idx < len; idx += 1) {
      // if (subPaths[idx].id === undefined) {
      // } else {
      try {
        await assignItem(
          { mid: subPaths[idx].id },
          subPaths[idx].parent,
          subPaths[idx].root,
          {
            tableName,
            object: object1,
            keyField,
            context,
            migrate: true,
          }
        );
      } catch (ex) {
        if (ex.code === "ALREADY_ASSIGNED") {
          // pass
        } else {
          throw ex;
        }
        //   console.log(
        //     "thisId:",
        //     subPaths[idx].id,
        //     "parent:",
        //     subPaths[idx].parent
        //   );
        //   console.log(
        //     "subPaths:",
        //     idx,
        //     lastIndex,
        //     len,
        //     JSON.stringify(subPaths)
        //   );
        //   throw ex;
      }
      // }

      // subPaths = getSubPaths(
      //   subPaths,
      //   subPaths[idx].subPaths,
      //   subPaths[idx].id
      // );
    }
    //   lastIndex = len;
    // }
  }

  const allMenus = oldOutMenus.concat(
    menusOfMigrated.map((each) => convertItemOut(each, keyField))
  );

  return {
    totalNumber: v1Menus.length,
    migratedNumber: oldOutMenus.length,
    count: allMenus.length,
    list: allMenus,
  };
}
module.exports.migrateMenu = migrateMenu;

async function getSubPaths(
  orgSubPaths,
  targetSubPaths,
  parentId,
  rootId,
  tableName,
  object1,
  keyField,
  context
) {
  if (targetSubPaths) {
    const newSubPaths = targetSubPaths
      .filter(
        (each) => orgSubPaths.findIndex((sp) => sp.parent === each.id) < 0
      )
      .map((each) => ({
        ...each,
        parent: parentId,
        root: rootId,
      }))
      .filter(
        (each) =>
          orgSubPaths.findIndex(
            (sp) => sp.parent === each.parent && sp.id === each.id
          ) < 0
      );

    let finalAllSubPaths = orgSubPaths.concat(newSubPaths);
    for (let idx = 0; idx < newSubPaths.length; idx += 1) {
      const each = newSubPaths[idx];

      if (each.id === undefined) {
        const newMenu = {
          ...each,
          isFolder: true,
        };
        delete newMenu.parent;
        delete newMenu.subPaths;

        const newResult = await createMenu(
          tableName,
          object1,
          keyField,
          newMenu,
          context
        );
        each.id = convertItemOut(newResult, keyField).mid;
      }

      finalAllSubPaths = await getSubPaths(
        finalAllSubPaths,
        each.subPaths,
        each.id,
        rootId,
        tableName,
        object1,
        keyField,
        context
      );
    }

    return finalAllSubPaths;
  }
  return orgSubPaths;
}

async function createPosition(tableName, object1, keyField, values, context) {
  const { dynamodb, makeid, isTruthy, request } = context;
  checkRequired(values, [getKeyField("position"), "name"]);

  if (isTruthy(values[keyField])) {
    throw new Error(`'${keyField}' should not be provided`);
  }

  const newBody = {
    ...values,
    [keyField]: makeid(4),
  };
  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );

  return result;
}
module.exports.createPosition = createPosition;

async function updatePosition(
  tableName,
  object1,
  keyField,
  values,
  { dynamodb, request }
) {
  checkRequired(values, [keyField, getKeyField("position")]);

  const newBody = {
    ...values,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(object1, newBody, keyField),
    convertValuesIn(object1, newBody, keyField),
    {
      ...getDdbOptions(request),
    }
  );
  return result;
}
module.exports.updatePosition = updatePosition;
