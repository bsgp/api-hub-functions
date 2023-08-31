function getDdbOptions() {
  return { useCustomerRole: true, useExactTableName: true };
}
module.exports.getDdbOptions = getDdbOptions;

function removeUndefinedKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

function checkRequired(data = {}, attributes = [], options = {}) {
  attributes.forEach((each) => {
    if ([undefined, null, "", "null"].includes(data[each])) {
      throw new Error(`${each} is required`);
    }
  });

  if (options.disallowOthers === true) {
    Object.keys(data).forEach((key) => {
      if (!attributes.includes(key)) {
        throw new Error(`Attribute '${key}' is not allowed`);
      }
    });
  }
  return true;
}
module.exports.checkRequired = checkRequired;

function deleteBackendAttributesForQuery(data, keys = {}) {
  const newData = { ...data };
  ["ttlts", "lowerName", "pkid", "skid", "pk2", "sk2"]
    .concat(Object.keys(keys))
    .forEach((key) => {
      delete newData[key];
    });
  return newData;
}

function pkidOut(pkid) {
  if (!pkid) {
    return [];
  }
  const [pkType, pkSys] = pkid.split(":");
  if (pkSys) {
    return [pkType, pkSys.split("#")[1]];
  }
  return [pkType];
}

function convertItemOut(newItem) {
  const newData = { ...newItem };

  const [pkType, sysId] = pkidOut(newItem.pkid);
  if (sysId) {
    newData.sid = sysId;
  }

  if (newData.skid) {
    const skParts = newItem.skid.split("#");
    newData.id = skParts[skParts.length - 1];

    switch (pkType) {
      case "ITEM":
        newData.unitId = skParts[4];
        break;
      case "RECORD":
        newData.unitId = skParts[4];
        break;
      case "COACT":
        if (skParts.length === 6) {
          // USER#MCT#{uid}#{cat_id}#COA#{coa_id}
          // COA#{coa_id}
          // newData.category = skParts[1];
        } else if (skParts.length === 10) {
          // USER#MCT#{uid}#{cat_id}#MON#REC#{mon_id}#{rec_id}#COA#{coa_id}
          // MON#REC#{mon_id}#{rec_id}#COA#{coa_id}
          // newData.category = skParts[3];
          // newData.unitId = skParts[6];
          // newData.recId = skParts[7];
        }
        break;
      case "COMMENT":
        // "MON#REC#COA#COM",
        // `${item.unitId}#${item.recId}#${item.coaId}`,
        newData.unitId = skParts[4];
        newData.recId = skParts[5];
        newData.coaId = skParts[6];
        break;
      default:
        break;
    }
  }

  if (newData.pk2) {
    switch (pkType) {
      case "UNIT":
        newData.category = newItem.pk2.split("#").pop();
        break;
      case "RECORD":
        newData.category = newItem.pk2.split("#")[4];
        newData.status = newItem.pk2.split("#")[5];
        break;
      case "COACT":
        newData.status = newItem.pk2.split("#")[3];
        break;
      case "COMMENT":
        newData.uid = newItem.pk2.split("#")[4];
        newData.category = newItem.pk2.split("#").pop();
        break;
      default:
        break;
    }
  }

  switch (pkType) {
    case "UNIT":
      if (newData.items === undefined) {
        newData.items = [];
      } else {
        newData.items = newItem.items.map(convertItemOut);
      }
      break;
    case "RECORD":
      if (newData.items === undefined) {
        newData.items = [];
      }
      break;
    default:
      break;
  }

  return deleteBackendAttributesForQuery(newData);
}
module.exports.convertItemOut = convertItemOut;

function convertKeysIn(item, pkid, keyField) {
  switch (pkid) {
    case "UNIT":
      // if (item.uid) {
      //   return {
      //     pkid: `${pkid}:SYS#${item.sid}`,
      //     skid: `SYS#USER#${item.sid}#${item.uid}`,
      //   };
      // }
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: `SYS#MON#${item.sid}#${item.id}`,
      };
    case "ITEM":
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: `SYS#MON#ITEM#${item.sid}#${item.unitId}#${item.id}`,
      };
    case "RECORD":
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: [
          "MCT#MON#REC",
          `${item.category}#${item.unitId}#${item.id}`,
        ].join("#"),
      };
    case "RECYCLE":
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: [keyField, item.uuid].join("#"),
      };
    case "STATS":
      if (item.ym && item.sid && item.uid && item.category) {
        return {
          pkid: `${pkid}:SYS#${item.sid}`,
          skid: ["MONTH", item.ym, "USER", item.uid, "MCT", item.category].join(
            "#"
          ),
        };
      }
      break;
    case "COACT":
      if (item.unitId && item.recId) {
        return {
          pkid: `${pkid}:SYS#${item.sid}`,
          skid: [
            "MON#REC",
            `${item.unitId}#${item.recId}`,
            "COA",
            `${item.id}`,
          ].join("#"),
        };
      }
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: [
          // "USER#MCT#MON#REC#COA",
          // "USER#MCT",
          // `${item.uid}#${item.category}`,
          "COA",
          `${item.id}`,
        ].join("#"),
      };
    case "COMMENT":
      if (item.unitId && item.recId) {
        return {
          pkid: `${pkid}:SYS#${item.sid}`,
          skid: [
            "MON#REC",
            "COA#COM",
            `${item.unitId}#${item.recId}`,
            `${item.coaId}`,
            `${item.id}`,
          ].join("#"),
        };
      }
      return {
        pkid: `${pkid}:SYS#${item.sid}`,
        skid: ["COA#COM", `${item.coaId}`, `${item.id}`].join("#"),
      };

    default:
      return undefined;
  }
}
module.exports.convertKeysIn = convertKeysIn;

function convertKeysToQuery(item, pkid) {
  switch (pkid) {
    case "UNIT":
      if (item.category) {
        if (item.sid) {
          return [
            {
              pk2: `UNIT:MCT#${item.category}`,
            },
            {
              skid: ["BEGINS_WITH", `SYS#MON#${item.sid}#`],
            },
          ];
        }

        return [
          {
            pk2: `UNIT:MCT#${item.category}`,
          },
          {
            skid: ["BEGINS_WITH", `SYS#MON#`],
          },
        ];
      }
      return [
        {
          pkid: `${pkid}:SYS#${item.sid}`,
        },
        {
          skid: ["BEGINS_WITH", `SYS#MON#${item.sid}#`],
        },
      ];
    case "ITEM":
      if (item.unitId) {
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            skid: ["BEGINS_WITH", `SYS#MON#ITEM#${item.sid}#${item.unitId}#`],
          },
        ];
      }
      return [
        {
          pkid: `${pkid}:SYS#${item.sid}`,
        },
        {
          skid: ["BEGINS_WITH", `SYS#MON#ITEM#${item.sid}#`],
        },
      ];
    case "RECORD":
      if (item.category && item.status) {
        if (item.unitId) {
          if (item.uid) {
            return [
              {
                pk2: [
                  `${pkid}:SYS#MCT#STATUS`,
                  `${item.sid}#${item.category}#${item.status}`,
                ].join("#"),
              },
              {
                sk2: [
                  "BEGINS_WITH",
                  [
                    `MCT#MON#USER#REC#${item.category}`,
                    `${item.unitId}#${item.uid}#`,
                  ].join("#"),
                ],
              },
            ];
          }
          return [
            {
              pk2: [
                `${pkid}:SYS#MCT#STATUS`,
                `${item.sid}#${item.category}#${item.status}`,
              ].join("#"),
            },
            {
              skid: [
                "BEGINS_WITH",
                `MCT#MON#REC#${item.category}#${item.unitId}#`,
              ],
            },
          ];
        }

        return [
          {
            pk2: [
              `${pkid}:SYS#MCT#STATUS`,
              `${item.sid}#${item.category}#${item.status}`,
            ].join("#"),
          },
          {
            skid: ["BEGINS_WITH", `MCT#MON#REC#${item.category}#`],
          },
        ];
      }
      if (item.category) {
        if (item.unitId) {
          return [
            {
              pkid: `${pkid}:SYS#${item.sid}`,
            },
            {
              skid: [
                "BEGINS_WITH",
                `MCT#MON#REC#${item.category}#${item.unitId}#`,
              ],
            },
          ];
        }

        if (item.uid) {
          return [
            {
              pkid: `${pkid}:SYS#${item.sid}`,
            },
            {
              skupd: [
                "BEGINS_WITH",
                `USER#MCT#UPD#${item.uid}#${item.category}#`,
              ],
            },
          ];
        }
      }
      if (item.uid) {
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            skupd: ["BEGINS_WITH", `USER#MCT#UPD#${item.uid}#`],
          },
        ];
      }
      break;
    case "COACT":
      if (item.uid && item.category) {
        if (item.unitId && item.recId) {
          return [
            {
              pkid: `${pkid}:SYS#${item.sid}`,
            },
            {
              sk2: [
                "BEGINS_WITH",
                [
                  `USER#MCT#${item.uid}#${item.category}`,
                  `MON#REC#${item.unitId}#${item.recId}#`,
                ].join("#"),
              ],
            },
          ];
        } else if (item.unitId) {
          return [
            {
              pkid: `${pkid}:SYS#${item.sid}`,
            },
            {
              sk2: [
                "BEGINS_WITH",
                `USER#MCT#${item.uid}#${item.category}#MON#REC#${item.unitId}#`,
              ],
            },
          ];
        }
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            sk2: ["BEGINS_WITH", `USER#MCT#${item.uid}#${item.category}#`],
          },
        ];
      } else if (item.updatedAtFrom && item.updatedAtTo) {
        if (item.uid) {
          return [
            {
              pkid: `${pkid}:SYS#${item.sid}`,
            },
            {
              skupd: [
                "BETWEEN",
                [
                  `USER#UPD#${item.uid}#${item.updatedAtFrom}`,
                  `USER#UPD#${item.uid}#${item.updatedAtTo}`,
                ],
              ],
            },
          ];
        }
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            updatedAt: ["BETWEEN", [item.updatedAtFrom, item.updatedAtTo]],
          },
        ];
      } else if (item.uid) {
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            sk2: ["BEGINS_WITH", `USER#MCT#${item.uid}#`],
          },
        ];
      }
      break;
    case "COMMENT":
      if (item.unitId && item.recId) {
        return [
          {
            pkid: `${pkid}:SYS#${item.sid}`,
          },
          {
            skid: [
              "BEGINS_WITH",
              [
                "MON#REC",
                "COA#COM",
                `${item.unitId}#${item.recId}`,
                `${item.coaId}`,
              ]
                .join("#")
                .concat("#"),
            ],
          },
        ];
      }
      return [
        {
          pkid: `${pkid}:SYS#${item.sid}`,
        },
        {
          skid: [
            "BEGINS_WITH",
            ["COA#COM", `${item.coaId}`].join("#").concat("#"),
          ],
        },
      ];
    default:
      return undefined;
  }
}

function convertValuesIn(item, pkid) {
  const newValues = deleteBackendAttributesForQuery(item);

  switch (pkid) {
    case "UNIT": {
      if (item.category) {
        newValues.pk2 = `${pkid}:MCT#${item.category}`;
      }
      // delete newValues.id;
      // delete newValues.sid;

      return removeUndefinedKeys(newValues);
    }
    case "ITEM": {
      // delete newValues.id;
      // delete newValues.unitId;
      // delete newValues.sid;

      return removeUndefinedKeys(newValues);
    }
    case "RECORD": {
      newValues.pk2 = [
        `${pkid}:SYS#MCT#STATUS`,
        `${item.sid}#${item.category}#${item.status}`,
      ].join("#");
      newValues.sk2 = [
        "MCT#MON#USER#REC",
        `${item.category}#${item.unitId}#${item.uid}#${item.id}`,
      ].join("#");
      (newValues.skupd = [
        "USER#MCT#UPD",
        `${item.uid}#${item.category}`,
        "{updatedAt}",
      ].join("#")),
        // delete newValues.id;
        // delete newValues.unitId;
        delete newValues.release;
      // delete newValues.status;
      // delete newValues.sid;

      return removeUndefinedKeys(newValues);
    }
    case "COACT": {
      if (item.status) {
        newValues.pk2 = `${pkid}:SYS#STATUS#${item.sid}#${item.status}`;
      }

      if (item.unitId && item.recId) {
        newValues.sk2 = [
          "USER#MCT",
          `${item.uid}#${item.category}`,
          "MON#REC",
          `${item.unitId}#${item.recId}`,
          "COA",
          `${item.id}`,
        ].join("#");
      } else {
        newValues.sk2 = [
          // "USER#MCT#MON#REC#COA",
          "USER#MCT",
          `${item.uid}#${item.category}`,
          "COA",
          `${item.id}`,
        ].join("#");
      }

      newValues.skupd = `USER#UPD#${item.uid}#{updatedAt}`;
      // delete newValues.id;
      // delete newValues.sid;
      // delete newValues.unitId;
      // delete newValues.recId;

      return removeUndefinedKeys(newValues);
    }
    case "COMMENT": {
      newValues.pk2 = [
        `${pkid}:SYS#USER#MCT`,
        `${item.sid}#${item.uid}#${item.category}`,
      ].join("#");
      // delete newValues.id;
      // delete newValues.sid;
      // delete newValues.unitId;
      // delete newValues.recId;
      // delete newValues.coaId;
      // delete newValues.category;

      return removeUndefinedKeys(newValues);
    }
    case "RECYCLE": {
      return {
        pk2: item.pkid,
        sk2: item.skid,
        originJsonString: JSON.stringify(item),
      };
      // delete newValues.id;
      // delete newValues.sid;

      // return removeUndefinedKeys(newValues);
    }
    case "STATS": {
      return removeUndefinedKeys(newValues);
    }
    default:
      return undefined;
  }
}
module.exports.convertValuesIn = convertValuesIn;

async function createUnit(
  tableName,
  values,
  { request, dynamodb, makeid, isTruthy }
) {
  checkRequired(values, ["category"]);

  if (isTruthy(values.id)) {
    throw new Error("'id' should not be provided");
  }

  const newBody = {
    ...values,
    id: makeid(5),
    sid: request.systemId,
  };
  delete newBody.users;
  delete newBody.items;

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(newBody, "UNIT"),
    convertValuesIn(newBody, "UNIT"),
    {
      ...getDdbOptions(),
    }
  );
  return result;
}
module.exports.createUnit = createUnit;

async function updateUnit(tableName, values, { request, dynamodb }) {
  checkRequired(values, ["id"]);

  const newBody = {
    ...values,
    sid: request.systemId,
  };
  delete newBody.users;
  delete newBody.items;

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(newBody, "UNIT"),
    convertValuesIn(newBody, "UNIT"),
    {
      ...getDdbOptions(),
    }
  );
  return result;
}
module.exports.updateUnit = updateUnit;

const getDefaultValue = (type, item) => {
  switch (type) {
    case "SWT": {
      const score = 1; // value === "ON" ? 1 : 0;
      const selectedQuestion = item.questions.find(
        (each) => each.score === score
      );
      const newValue = selectedQuestion.id;
      return [newValue];
    }
    default:
      return [];
  }
};

async function queryUnitById(tableName, values, context) {
  const { request, dynamodb } = context;

  checkRequired(values, ["id"]);

  const newBody = {
    ...values,
    sid: request.systemId,
  };
  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(newBody, "UNIT"),
    {
      ...getDdbOptions(),
    }
  );

  if (result) {
    const items = await queryItemsByUnitId(
      tableName,
      { unitId: values.id },
      context
    );

    if (values.getInitialValue === true) {
      items.forEach((item) => {
        item.na = false;
        item.value = getDefaultValue(item.type, item);
        item.allowed = shouldActiveItem(item.id, items);
        item.conditionText = getConditionText(item, items);
      });
    }

    result.items = items;
  }

  return result;
}
module.exports.queryUnitById = queryUnitById;

async function queryAllUnitInCurrentSystem(tableName, { request, dynamodb }) {
  const newBody = {
    sid: request.systemId,
  };
  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(newBody, "UNIT"),
    {
      ...getDdbOptions(),
    }
  );
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryAllUnitInCurrentSystem = queryAllUnitInCurrentSystem;

async function queryUnitByCategory(tableName, values, { request, dynamodb }) {
  checkRequired(values, ["category"]);

  const newBody = {
    category: values.category,
    sid: request.systemId,
  };
  const pkskObjs = convertKeysToQuery(newBody, "UNIT");
  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
  });
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryUnitByCategory = queryUnitByCategory;

async function queryUnitOfMeByCategory(
  tableName,
  values,
  { request, dynamodb, dayjs, kst }
) {
  checkRequired(values, ["category"]);

  const newBody = {
    category: values.category,
    sid: request.systemId,
  };
  const pkskObjs = convertKeysToQuery(newBody, "UNIT");
  const result = await dynamodb.query(tableName, ...pkskObjs, {
    filters: {
      users: {
        operation: "contains",
        value: request.userId,
      },
    },
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
  });
  // draft.response.body = { newBody, result };

  return result
    .filter((each) => each.validFrom && each.validTo)
    .filter((each) => {
      const from = dayjs(each.validFrom);
      const to = dayjs(each.validTo);
      // console.log(from.format(), to.format(), kst.format());
      return kst.isBetween(from, to, "hour", "[)");
    });
}
module.exports.queryUnitOfMeByCategory = queryUnitOfMeByCategory;

async function queryUnitBySearch(tableName, values, { dynamodb }) {
  checkRequired(values, ["category"]);

  const keyword = values.keyword || "";

  const newBody = {
    category: values.category,
    // sid: request.systemId,
  };
  const keysIn = convertKeysToQuery(newBody, "UNIT");
  const result = await dynamodb.query(tableName, ...keysIn, {
    ...(keysIn[0].pk2 ? { indexName: "pk2-skid-index" } : {}),
    ...getDdbOptions(),
    filters: {
      lowerName: {
        operation: "contains",
        value: keyword.toLowerCase(),
      },
    },
  });
  // draft.response.body = { newBody, result };
  return result;
}
module.exports.queryUnitBySearch = queryUnitBySearch;

async function addUsersToUnit(tableName, values, context) {
  const { request, dynamodb, isArray, isFalsy } = context;
  checkRequired(values, ["id", "category", "userIds"]);

  if (isArray(values.userIds)) {
    if (isFalsy(values.userIds)) {
      throw new Error("추가할 사용자 리스트가 비었습니다");
    }
  } else {
    throw new Error("사용자 리스트는 배열 타입이어야 합니다");
  }

  const newBody = {
    ...values,
    sid: request.systemId,
  };

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(newBody, "UNIT"),
    {
      users: newBody.userIds,
    },
    {
      operations: {
        users: "ADD",
      },
      sets: { users: "string" },
      ...getDdbOptions(),
    }
  );

  // await dynamodb.transaction(
  //   [
  //     // add unit to user
  // ...values.userIds.map((eachUid) => ({
  //   tableName,
  //   type: "Update",
  //   keys: convertKeysIn({ ...newBody, uid: eachUid }, "UNIT"),
  //   values: {
  //     units: [newBody.id],
  //   },
  //   options: {
  //     operations: {
  //       units: "ADD",
  //     },
  //     sets: {
  //       units: "string",
  //     },
  //   },
  // })),

  //   // add roles to user
  //   {
  //     tableName,
  //     type: "Update",
  //     keys: convertKeysIn(newBody, "UNIT"),
  //     values: {
  //       users: newBody.userIds,
  //       pk2: convertValuesIn(newBody, "UNIT").pk2,
  //     },
  //     options: {
  //       operations: {
  //         users: "ADD",
  //       },
  //       sets: { users: "string" },
  //     },
  //   },
  // ],
  // {
  //   ...getDdbOptions(),
  // }
  // );
  //
  // const result = await queryUnitById(tableName, { id: newBody.id }, context);
  return result;
}
module.exports.addUsersToUnit = addUsersToUnit;

async function createItem(
  tableName,
  values,
  { request, dynamodb, makeid, isTruthy }
) {
  checkRequired(values, ["unitId", "name"]);

  if (isTruthy(values.id)) {
    throw new Error("'id' should not be provided");
  }

  const newBody = {
    ...values,
    id: makeid(10),
    sid: request.systemId,
  };

  delete newBody.allowed;
  delete newBody.conditionText;

  const result = await dynamodb.insertItem(
    tableName,
    convertKeysIn(newBody, "ITEM"),
    convertValuesIn(newBody, "ITEM"),
    {
      ...getDdbOptions(),
    }
  );
  return result;
}
module.exports.createItem = createItem;

async function updateItem(tableName, values, { request, dynamodb }) {
  checkRequired(values, ["id", "unitId"]);

  const newBody = {
    ...values,
    sid: request.systemId,
  };

  delete newBody.allowed;
  delete newBody.conditionText;

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(newBody, "ITEM"),
    convertValuesIn(newBody, "ITEM"),
    {
      ...getDdbOptions(),
    }
  );
  return result;
}
module.exports.updateItem = updateItem;

async function copyItems(tableName, values, context) {
  const { isArray } = context;

  checkRequired(values, ["items", "unitId", "sourceUnitId"]);
  if (!isArray(values.items)) {
    throw new Error("'items' must be Array type");
  }
  values.items.forEach((item) => checkRequired(item, ["id"]));

  // get source unit and its items
  const sourceUnit = await queryUnitById(
    tableName,
    { id: values.sourceUnitId },
    context
  );
  // filter selected items
  const selectedItems = sourceUnit.items
    .map(convertItemOut)
    .filter(
      (item) => values.items.filter((each) => each.id === item.id).length > 0
    );
  if (selectedItems.length === 0) {
    throw new Error("Can not find matched items from source unit");
  }

  const items = await queryItemsByUnitId(
    tableName,
    { unitId: values.unitId },
    context
  );
  let lastSeq = items.length;

  // create items for this unit
  for (const item of selectedItems) {
    const newItem = { ...item, unitId: values.unitId };
    delete newItem.id;
    newItem.seq = lastSeq = lastSeq + 1;
    await createItem(tableName, newItem, context);
  }

  // get target unit and its items
  const result = await queryUnitById(tableName, { id: values.unitId }, context);

  return result;
}
module.exports.copyItems = copyItems;

async function changeItemSequence(tableName, values, context) {
  // const { createSorter } = context;

  checkRequired(values, [
    "unitId",
    "fromId",
    // "fromSeq",
    "toId",
    // "toSeq",
    "position",
  ]);

  // get source unit and its items
  const items = await queryItemsByUnitId(
    tableName,
    { unitId: values.unitId },
    context
  );
  let outItems = items.map(convertItemOut);

  // let baseIndex;
  // = values.fromSeq;
  // if (values.fromSeq > values.toSeq) {
  //   baseSeq = values.toSeq;
  // }

  // if (
  //   outItems[values.fromSeq - 1].id === values.fromId &&
  //   outItems[values.toSeq - 1].id === values.toId
  // ) {
  let fromData;
  let fromIndex;
  let toIndex;
  outItems = outItems.filter((item, index) => {
    if (item.id === values.toId) {
      toIndex = index;
    }
    const result = item.id !== values.fromId;
    if (result === false) {
      fromData = item;
      fromIndex = index;
      // baseIndex = index;
    }
    return result;
  });

  if (!fromData) {
    return items;
  } else {
    if (
      fromData.conditions &&
      fromData.conditions.filter((cond) => !cond.inactive).length > 0
    ) {
      throw new Error("조건이 있는 항목은 이동할수 없습니다");
    }

    // from이 하위 순서 아이템들의 조건에 포함되어 있을 경우, 이동 불가
    if (fromIndex < toIndex) {
      for (let idx = fromIndex + 1; idx < toIndex; idx += 1) {
        if (outItems[idx].conditions) {
          if (
            outItems[idx].conditions
              .filter((cond) => !cond.inactive)
              .filter((cond) => cond.itemId === fromData.id).length > 0
          ) {
            throw new Error(
              "이동하고자 하는 항목이 다른 항목의 조건에 포함되어 이동할수 없습니다"
            );
          }
        }
      }
    }

    // inactive에서 active시킬때에도 점검 필요
  }

  outItems = outItems.reduce((pre, cur) => {
    if (cur.id === values.toId) {
      // if(baseIndex > index){
      //   baseIndex = index;
      // }
      if (values.position === "After") {
        return pre.concat(cur, fromData);
      }
      return pre.concat(fromData, cur);
    }
    return pre.concat(cur);
  }, []);
  // } else {
  //   baseSeq = 1;
  // }

  // create items for this unit
  for (let idx = 0; idx < outItems.length; idx += 1) {
    const outItem = outItems[idx];
    // if(baseIndex <= idx && outItem.seq !== undefined){

    // }
    outItem.seq = idx + 1;
    await updateItem(
      tableName,
      { id: outItem.id, unitId: outItem.unitId, seq: outItem.seq },
      context
    );
  }

  const results = await queryItemsByUnitId(
    tableName,
    { unitId: values.unitId },
    context
  );

  return results;
}
module.exports.changeItemSequence = changeItemSequence;

async function queryItemsByUnitId(
  tableName,
  values,
  { request, createSorter, dynamodb }
) {
  const newBody = {
    unitId: values.unitId,
    sid: request.systemId,
  };

  const result = await dynamodb.query(
    tableName,
    ...convertKeysToQuery(newBody, "ITEM"),
    {
      ...getDdbOptions(),
    }
  );

  result.sort(createSorter(["seq"], "asc"));
  return result;
}
module.exports.queryItemsByUnitId = queryItemsByUnitId;

async function queryRecordById(tableName, values, context) {
  const { request, dynamodb } = context;
  checkRequired(values, ["unitId", "id", "category"]);

  const newBody = {
    ...values,
    uid: request.userId,
    sid: request.systemId,
  };

  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(newBody, "RECORD"),
    {
      ...getDdbOptions(),
    }
  );

  return result;
}
module.exports.queryRecordById = queryRecordById;

async function queryUnreleasedRecord(tableName, values, context) {
  const { request, dynamodb } = context;

  checkRequired(values, ["unitId", "category"]);

  const newBody = {
    ...values,
    uid: request.userId,
    sid: request.systemId,
    status: "AUTO",
  };

  const pkskObjs = convertKeysToQuery(newBody, "RECORD");

  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
  });
  if (result.length === 1) {
    return result[0];
  } else if (result.length === 0) {
    return undefined;
  } else {
    throw new Error("예기치 못한 오류발생: 레코드 결과가 1개 이상");
  }
}
module.exports.queryUnreleasedRecord = queryUnreleasedRecord;

function getIndexName(keys) {
  if (keys[1].sk2 && keys[0].pk2) {
    return "pk2-sk2-index";
  }
  if (keys[1].skupd && keys[0].pk2) {
    return "pk2-skupd-index";
  }
  if (keys[1].updatedAt) {
    return "pkid-updatedAt-index";
  }
  if (keys[0].pk2) {
    return "pk2-skid-index";
  }
  if (keys[1].skupd) {
    return "pkid-skupd-index";
  }
  if (keys[1].sk2) {
    return "pkid-sk2-index";
  }
  return undefined;
}

async function queryRecordByUserId(tableName, values, { request, dynamodb }) {
  checkRequired(values, ["uid"]);

  const newBody = {
    ...values,
    // uid: request.userId,
    sid: request.systemId,
  };

  const pkskObjs = convertKeysToQuery(newBody, "RECORD");

  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
    filters: {
      status: {
        operation: "=",
        value: "RELE",
      },
    },
  });

  if (result.length === 0) {
    return result;
  }

  // TODO: 모니터링 세트 name값을 읽어와야 함.
  const resultOut = result.map(convertItemOut);
  // console.log("RECORD:pkskObjs:", pkskObjs);
  // console.log("RECORD:resultOut:", resultOut);
  const unitIds = Array.from(
    resultOut
      .map((each) => each.unitId)
      .filter(Boolean)
      .reduce((acc, unitId) => {
        acc.add(unitId);
        return acc;
      }, new Set())
  );
  // console.log("RECORD:unitIds:", unitIds);
  const units = await dynamodb.batchGetItem(
    tableName,
    unitIds.map((unitId) =>
      convertKeysIn({ id: unitId, sid: newBody.sid }, "UNIT")
    ),
    { ...getDdbOptions() }
  );
  const unitObj = units.reduce((acc, unit) => {
    const unitOut = convertItemOut(unit);
    acc[unitOut.id] = unitOut;
    return acc;
  }, {});

  return resultOut.map((each) => {
    // if (unitObj[each.unitId] === undefined) {
    //   console.log("resultOut:", resultOut);
    //   console.log("each:", each);
    //   console.log("unitObj:", unitObj);
    // }
    each.name = unitObj[each.unitId].name;
    return each;
  });
}
module.exports.queryRecordByUserId = queryRecordByUserId;

async function querySummary(tableName, values, context) {
  const { request, dynamodb, kst, tryit } = context;

  const newValues = {
    ym: kst.format("YYYYMM"),
    sid: request.systemId,
    uid: request.userId,
    category: values.category,
  };

  const statsKeys = convertKeysIn(newValues, "STATS");
  console.log("statsKeys:", statsKeys, newValues);

  const result = await dynamodb.getItem(tableName, statsKeys, {
    ...getDdbOptions(),
  });

  const summaryData = {
    recordCountThisMonth: tryit(() => result.records) || 0,
    safetyItemPercentThisMonth:
      tryit(() =>
        result.swt === 0 ? 0 : Math.round((result.safety / result.swt) * 100)
      ) || 0,
    swtItemCountThisMonth: tryit(() => result.swt) || 0,
    coactCountAllUnread: tryit(() => result.coactsUnread.length) || 0,
    coactCountAll: tryit(() => result.coactsAll.length) || 0,
  };

  summaryData.coactPercentAllNotCMPL =
    tryit(() =>
      Math.round(
        (result.coactsNotCmpl.length / summaryData.coactCountAll) * 100
      )
    ) || 0;

  return summaryData;
}
module.exports.querySummary = querySummary;

async function deleteUnreleasedRecord(
  tableName,
  values,
  { request, dynamodb }
) {
  // draft
  checkRequired(values, ["unitId", "id", "category"]);

  const newBody = {
    ...values,
    uid: request.userId,
    sid: request.systemId,
    status: "AUTO",
  };

  const result = await dynamodb.deleteItem(
    tableName,
    convertKeysIn(newBody, "RECORD"),
    {
      ...getDdbOptions(),
      conditions: {
        pk2: {
          operation: "=",
          value: [
            `RECORD:SYS#MCT#STATUS`,
            `${newBody.sid}#${newBody.category}#${newBody.status}`,
          ].join("#"),
        },
      },
    }
  );

  return result;
}
module.exports.deleteUnreleasedRecord = deleteUnreleasedRecord;

function shouldActiveItem(thisItemId, allItems) {
  const allItemObjects = allItems.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  const thisItem = allItemObjects[thisItemId];
  console.log("thisItemId:", thisItemId, JSON.stringify(allItems));

  if (!thisItem.conditions) {
    console.log(
      "thisItem.conditions:",
      !thisItem.conditions,
      thisItem.conditions
    );
    return true;
  }
  if (thisItem.conditions.length === 0) {
    console.log(
      "thisItem.conditions.length === 0:",
      thisItem.conditions.length
    );
    return true;
  }

  const activeConditions = thisItem.conditions.filter(
    (cond) =>
      !cond.inactive && cond.itemId && cond.values && cond.values.length > 0
  );
  if (activeConditions.length === 0) {
    console.log("activeConditions.length:", activeConditions.length);
    return true;
  }

  const conditionsHaveValues = activeConditions.filter((cond) => {
    if (cond.values.length === 0) {
      return false;
    }
    return true;
  });
  if (conditionsHaveValues.length === 0) {
    console.log(
      "conditionsHaveValues.length === 0",
      JSON.stringify(activeConditions)
    );
    return false;
  }

  const matchedConditions = conditionsHaveValues.filter((cond) => {
    return cond.values.reduce((acc, condVal) => {
      if (acc === false) {
        return acc;
      }
      const srcItem = allItemObjects[cond.itemId];
      if (!srcItem) {
        console.log("srcItem:", srcItem, cond.itemId);
        return false;
      }
      if (!srcItem.value) {
        console.log("srcItem.value:", srcItem.value, cond.itemId);
        return false;
      }
      if (srcItem.value.length === 0) {
        console.log("srcItem.value.length === 0:", srcItem.value, cond.itemId);
        return false;
      }
      return srcItem.value.includes(condVal);
    }, true);
  });

  console.log(
    "thisItemId:final:",
    matchedConditions.length,
    conditionsHaveValues.length,
    JSON.stringify(matchedConditions),
    JSON.stringify(conditionsHaveValues)
  );

  if (matchedConditions.length === conditionsHaveValues.length) {
    return true;
  }

  return false;
}

function getConditionText(item, allItems) {
  const itemObjects = allItems.reduce((acc, each) => {
    acc[each.id] = each;
    return acc;
  }, {});

  const activeConditions = item.conditions
    ? item.conditions.filter(
        (cond) =>
          !cond.inactive && cond.itemId && cond.values && cond.values.length > 0
      )
    : [];
  if (activeConditions.length > 0) {
    return "활성화조건:\n".concat(
      activeConditions
        .map((cond) => {
          return [
            [
              itemObjects[cond.itemId].seq,
              ": ",
              itemObjects[cond.itemId].name,
            ].join(""),
          ]
            .concat(
              itemObjects[cond.itemId].questions
                .filter((qst) => cond.values.includes(qst.id))
                .map((qst) => qst.name)
            )
            .join("\n  - ");
        })
        .join("\n")
    );
  }
  return undefined;
}

async function saveRecord(tableName, values, context, draft) {
  const { request, dynamodb, makeid, isArray, isTruthy, dayjs } = context;

  const { LOCKKEY } = dynamodb;
  checkRequired(values, ["unitId", "items", "category"]);

  if (values.id) {
    checkRequired(values, [LOCKKEY]);
  }
  if (values.release === true) {
    checkRequired(values, ["id"]);
  }

  if (!isArray(values.items)) {
    throw new Error("'items' should be Array type");
  }
  values.items.forEach((each) =>
    checkRequired(each, ["id", "na", "value"], { disallowOthers: true })
  );

  // if (isArray(values.images)) {
  //   values.images = values.images.filter(
  //     (img) => isTruthy(img) && isTruthy(img.file)
  //   );
  // }

  let qResult;
  if (values.id) {
    qResult = await queryRecordById(
      tableName,
      { unitId: values.unitId, id: values.id, category: values.category },
      { request, dynamodb }
    );
    if (qResult === undefined) {
      throw new Error("지정된 레코드를 찾을수 없습니다");
    }
  } else {
    qResult = await queryUnreleasedRecord(
      tableName,
      { unitId: values.unitId, category: values.category },
      { request, dynamodb }
    );
    if (qResult === undefined) {
      qResult = { items: [] };
    }
  }

  if (qResult[LOCKKEY]) {
    if (qResult[LOCKKEY] !== values[LOCKKEY]) {
      // draft.response.body = {
      //   errorMessage: `${LOCKKEY} conflicts with remote ${LOCKKEY}`,
      // };
      draft.response.headers.statusCode = 409;
      throw new Error(
        [
          "서버에 있는 데이터와 버전이 다릅니다.",
          "새로고침을 하여 최신 버전을 확인하시기 바랍니다.",
          "Provided LockKey is different with remote LockKey",
        ].join("\n")
      );
    }
  }

  const thisIsNew = !qResult.pkid;

  const outResult = convertItemOut(qResult);

  // values.items has [A, B], but outResult.items has [B, C, D];
  // finalItems should has [A, B, C, D];
  values.items.forEach((newEach) => {
    const oldItem = outResult.items.find(
      (oldEach) => oldEach.id === newEach.id
    );
    if (oldItem === undefined) {
      // newEach is new, and add this newEach into outResult.items;
      outResult.items.push({ ...newEach });
    } else {
      Object.keys(oldItem).forEach((oldKey) => {
        delete oldItem[oldKey];
      });
      // merge newEach to oldItem
      Object.keys(newEach).forEach((newKey) => {
        oldItem[newKey] = newEach[newKey];
      });
    }
  });

  const newBody = {
    ...values,
    uid: outResult.uid || request.userId,
    [LOCKKEY]: outResult[LOCKKEY],
    id: outResult.id || makeid(10),
    sid: outResult.sid || request.systemId,
    items: outResult.items,
    status: values.release === true ? "RELE" : outResult.status || "AUTO",
  };

  if (newBody.convos) {
    if (newBody.convos.length > 0) {
      newBody.hasConvo = true;
      newBody.hasImage =
        newBody.convos.filter((convo) => convo.images.length > 0).length > 0;
    } else {
      newBody.hasConvo = false;
    }
  }

  delete newBody.convos;

  checkRequired(newBody, ["uid"]);

  const newItemObjects = newBody.items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  let masterItems = await queryItemsByUnitId(
    tableName,
    { unitId: values.unitId },
    context
  );
  masterItems = masterItems.filter((mItem) => newItemObjects[mItem.id]);

  masterItems.forEach((mItem) => {
    mItem.value = newItemObjects[mItem.id].value;
  });

  newBody.items.forEach((item) => {
    item.allowed = shouldActiveItem(item.id, masterItems);
  });
  // console.log("newBody:", JSON.stringify(newBody));

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(newBody, "RECORD"),
    convertValuesIn(newBody, "RECORD"),
    {
      checkLock: !thisIsNew,
      ...getDdbOptions(),
    }
  );

  const statsSets = {};
  const statsOperations = {};
  const statsValues = {
    ym: dayjs.tz(result.createdAt, "Asia/Seoul").format("YYYYMM"),
    sid: result.sid,
    uid: result.uid,
    category: result.category,
  };
  if (result.status === "RELE" && outResult.status !== result.status) {
    statsValues.records = 1;
    statsSets.records = "number";
    statsOperations.records = "ADD";

    const swtNumbers = masterItems.reduce(
      (acc, item) => {
        console.log(
          "item.allowed && item.type",
          newItemObjects[item.id].allowed,
          item.type,
          item.value
        );
        if (newItemObjects[item.id].allowed && item.type === "SWT") {
          acc.swt += 1;
          if (item.value) {
            const valueOn = getDefaultValue(item.type, item);
            if (valueOn[0] === item.value[0]) {
              acc.safety += 1;
            }
          }
        }
        return acc;
      },
      { safety: 0, swt: 0 }
    );

    Object.keys(swtNumbers).forEach((key) => {
      statsValues[key] = swtNumbers[key];
      statsSets[key] = "number";
      statsOperations[key] = "ADD";
    });
  }

  if (isTruthy(statsOperations)) {
    await dynamodb.updateItem(
      tableName,
      convertKeysIn(statsValues, "STATS"),
      convertValuesIn(statsValues, "STATS"),
      {
        ...getDdbOptions(),
        operations: statsOperations,
        sets: statsSets,
      }
    );
  }

  if (values.convos) {
    for (let idx = 0; idx < values.convos.length; idx += 1) {
      const eachConvo = values.convos[idx];
      if (eachConvo.id) {
        await saveCoact(
          tableName,
          {
            ...eachConvo,
            recStatus: newBody.status,
            unitId: newBody.unitId,
            recId: newBody.id,
            category: newBody.category,
          },
          context,
          draft
        );
      }
    }
  }

  return result;
}
module.exports.saveRecord = saveRecord;

async function mergeUnitToRecord(recordData, tableName, values, context) {
  const { createSorter } = context;

  let unitData = await queryUnitById(tableName, values, context);
  unitData = convertItemOut(unitData);

  const newRecord = convertItemOut(recordData);

  newRecord.name = unitData.name;

  newRecord.items.forEach((item) => {
    const unitItem = unitData.items.find((each) => each.id === item.id);
    if (unitItem) {
      Object.keys(unitItem).forEach((key) => {
        item[key] = unitItem[key];
      });
    }
    item.conditionText = getConditionText(item, unitData.items);
  });

  if (values.coaId) {
    const convo = await queryCoactById(
      tableName,
      {
        id: values.coaId,
        unitId: newRecord.unitId,
        recId: newRecord.id,
        category: newRecord.category,
        // uid: newRecord.uid,
        // excludeDeletedImage: true,
      },
      context
    );

    newRecord.convos = [convertItemOut(convo)];
  } else {
    const convos = await queryCoactByRecId(
      tableName,
      {
        unitId: newRecord.unitId,
        recId: newRecord.id,
        category: newRecord.category,
        // excludeDeletedImage: true,
      },
      context
    );
    convos.list.sort(createSorter(["createdAt"], "asc"));

    newRecord.convos = convos.list.map(convertItemOut);
  }

  return newRecord;
}
module.exports.mergeUnitToRecord = mergeUnitToRecord;

async function queryCoactById(tableName, values, { request, dynamodb }) {
  // checkRequired(values, ["id", "category"]);
  checkRequired(values, ["id"]);
  if (["BBS", "LSC"].includes(values.category)) {
    checkRequired(values, ["recId", "unitId"]);
  }

  const newBody = {
    ...values,
    // uid: values.uid || request.userId,
    sid: request.systemId,
  };

  const result = await dynamodb.getItem(
    tableName,
    convertKeysIn(newBody, "COACT"),
    {
      ...getDdbOptions(),
    }
  );

  // if (result.images && values.excludeDeletedImage === true) {
  //   result.images = result.images.filter((img) => img.deleted !== true);
  // }

  return result;
}
module.exports.queryCoactById = queryCoactById;

// function removeDeletedImage(oneCoact) {
//   if (oneCoact.images) {
//     oneCoact.images = oneCoact.images.filter((img) => img.deleted !== true);
//   }

//   return oneCoact;
// }
// module.exports.removeDeletedImage = removeDeletedImage;

async function saveCoact(tableName, values, context, draft) {
  const { request, dynamodb, makeid, isBoolean, dayjs, isTruthy, tryit, flow } =
    context;

  const { LOCKKEY } = dynamodb;
  checkRequired(values, ["category"]);
  if (["BBS", "LSC"].includes(values.category)) {
    checkRequired(values, ["unitId", "recId"]);
  }

  if (values.safety !== undefined) {
    if (["ON", "OFF"].includes(values.safety)) {
      // pass
    } else {
      throw new Error(
        "safety 속성에 ON, OFF 값만 허용됩니다, 실제 입력된 값은 " +
          tryit(() => values.safety.toString(), values.safety)
      );
    }
  }
  if (values.assigneeId !== undefined) {
    const re = /[^\x00-\x7F]+/; // check has non-ascii characters
    if (re.test(values.assigneeId)) {
      throw new Error(
        "대상자에 직접 이름을 입력하지 말고 선택해서 입력해주세요"
      );
    }
  }

  let hasId = !!values.id;
  if (hasId) {
    if (values.id.startsWith("TMP-")) {
      hasId = false;
    }
  }

  if (hasId) {
    checkRequired(values, [LOCKKEY]);
  }
  if (values[LOCKKEY]) {
    checkRequired(values, ["id"]);
  }

  // if (isArray(values.images)) {
  //   values.images = values.images.filter(
  //     (img) => isTruthy(img) && isTruthy(img.file)
  //   );
  // }

  let outResult = { ...values };
  let oldAssigneeId;
  // let thisIsNew = true;
  if (hasId) {
    const qResult = await queryCoactById(
      tableName,
      {
        id: values.id,
        // category: values.category,
        unitId: values.unitId,
        recId: values.recId,
        // uid: values.uid,
      },
      context
    );
    if (qResult === undefined) {
      // if (["BBS", "LSC"].includes(values.category)) {
      //   // pass
      // } else {
      //   throw new Error("지정된 점검실시를 찾을수 없습니다");
      // }
      throw new Error("업데이트할 항목을 찾을수 없습니다");
    }

    // if (["BBS", "LSC"].includes(values.category)) {
    //   // pass
    // } else {
    if (qResult) {
      if (qResult[LOCKKEY]) {
        if (qResult[LOCKKEY] !== values[LOCKKEY]) {
          // draft.response.body = {
          //   errorMessage: `${LOCKKEY} conflicts with remote ${LOCKKEY}`,
          // };
          draft.response.headers.statusCode = 409;
          throw new Error(
            [
              "서버에 있는 데이터와 버전이 다릅니다.",
              "새로고침을 하여 최신 버전을 확인하시기 바랍니다.",
              "Provided LockKey is different with remote LockKey",
            ].join("\n")
          );
        }
      }
    }
    // thisIsNew = !qResult;
    // }

    // if (qResult) {
    outResult = convertItemOut(qResult);
    oldAssigneeId = qResult.assigneeId;

    if (values.deleted === true && outResult.recStatus === "RELE") {
      throw new Error("이미 제출한 대상은 삭제할수 없습니다");
    }
    // } else {
    //   outResult = values;
    // }

    // values.items has [A, B], but outResult.items has [B, C, D];
    // finalItems should has [A, B, C, D];
    if (values.images) {
      values.images.forEach((newEach) => {
        const oldItem = outResult.images.find(
          (oldEach) => oldEach.id === newEach.id
        );
        if (oldItem === undefined) {
          // newEach is new, and add this newEach into outResult.images;
          outResult.images.push(newEach);
        } else {
          Object.keys(oldItem).forEach((oldKey) => {
            delete oldItem[oldKey];
          });
          // merge newEach to oldItem
          Object.keys(newEach).forEach((newKey) => {
            oldItem[newKey] = newEach[newKey];
          });
        }
      });
    }
  }

  const images = { remained: [], recycle: [] };

  if (outResult.images) {
    outResult.images.forEach((img) => {
      if (img.deleted === true) {
        images.recycle.push(img);
      } else {
        images.remained.push(img);
      }
    });
  }

  const newBody = {
    ...values,
    images: images.remained,
    uid: hasId ? outResult.uid : values.uid || request.userId,
    [LOCKKEY]: outResult[LOCKKEY],
    id: hasId ? outResult.id : makeid(12),
    sid: request.systemId,
    pid: request.partnerId,
    status: hasId ? values.status || outResult.status : "RELE",
  };
  delete newBody.assignee;
  delete newBody.comments;
  delete newBody.groups;
  delete newBody.users;

  checkRequired(newBody, ["uid"]);

  const operations = {};
  const sets = {};
  // if (["RELE", "NOTA"].includes(newBody.raStatus)) {
  //   operations.raStatus = "IF_NOT_EXISTS";
  // }

  if (newBody.wantRa === "ON") {
    newBody.raStatus = "RELE";
    operations.raStatus = "IF_NOT_EXISTS";
  }

  const msgPushes = [];

  const coactStatus = {
    RELE: "요청",
    INPR: "진행중",
    CMPL: "조치완료",
  };

  // let msgNewLiker;
  if (isBoolean(values.like)) {
    newBody.likers = [request.userId];
    sets.likers = "string";
    delete newBody.like;

    if (values.like === true) {
      operations.likers = "ADD";
      if (!outResult.likers || !outResult.likers.includes(request.userId)) {
        const usersResult = await flow.run({
          id: "directory_v2",
          method: "GET",
          body: {
            object: "user",
            queryById: {
              sid: request.systemId,
              uid: request.userId,
            },
          },
        });
        const newUser = usersResult.list[0];
        msgPushes.push({
          uid: request.userId,
          title: `${newUser.name}님이 안전대화를 좋아합니다`,
          body: "상세한 내역은 클릭하여 확인하세요",
        });
      }
    } else if (values.like === false) {
      operations.likers = "SUB";
    }
  } else {
    delete newBody.likers;
  }

  // else if (newBody.wantRa === "OFF") {
  //   newBody.raStatus = "NOTA";
  // }

  const newCoactKeys = convertKeysIn(newBody, "COACT");
  const newCoactValues = convertValuesIn(newBody, "COACT");
  // newCoactValues.cwLogId = request.cwLogId;

  const result = await dynamodb.updateItem(
    tableName,
    newCoactKeys,
    newCoactValues,
    {
      checkLock: hasId,
      ...getDdbOptions(),
      operations,
      sets,
    }
  );

  // console.log("saved coact:", JSON.stringify(result));

  // let msgReleNewAssignee;
  if (result.recStatus === "RELE" && result.safety === "OFF") {
    if (result.assigneeId !== oldAssigneeId || outResult.recStatus !== "RELE") {
      if (result.assigneeId) {
        msgPushes.push({
          uid: result.assigneeId,
          title: "안전대화의 대상자로 지정되었습니다",
          body: "상세한 내역은 클릭하여 확인하세요",
        });
      } else {
        console.log(
          "failed:sendMessageToUser:result.assigneeId is falsy",
          result.assigneeId
        );
      }
    } else {
      console.log(
        "failed:sendMessageToUser:assigneeId not changed or oldStatus was RELE",
        result.assigneeId,
        oldAssigneeId,
        outResult.status
      );
    }
  }
  // else {
  //   console.log(
  //     "faild:sendMessageToUser:",
  //     result.recStatus,
  //     result.assigneeId,
  //     oldAssigneeId
  //   );
  // }

  if (outResult.raStatus && result.raStatus !== outResult.raStatus) {
    const msgObj = {
      uid: result.uid,
      title: `안전대화의 위험성 평가상태가 ${
        coactStatus[result.raStatus] || result.raStatus
      }으로 변경 되었습니다.`,
      body: "상세한 내역은 클릭하여 확인하세요",
    };
    msgPushes.push(msgObj);
    if (result.assigneeId) {
      msgPushes.push({ ...msgObj, uid: result.assigneeId });
    }
  }

  if (outResult.status && result.status !== outResult.status) {
    const msgObj = {
      uid: result.uid,
      title: `안전대화의 상태가 ${
        coactStatus[newBody.status] || newBody.status
      }으로 변경 되었습니다.`,
      body: "상세한 내역은 클릭하여 확인하세요",
    };
    msgPushes.push(msgObj);
    if (result.assigneeId) {
      msgPushes.push({ ...msgObj, uid: result.assigneeId });
    }
  }

  if (msgPushes.length > 0) {
    await Promise.all(
      msgPushes.map((msgObj) =>
        sendMessageToUser(
          {
            sid: result.sid,
            pid: result.pid,
            category: result.category,
            recId: result.recId,
            id: result.id,
            unitId: result.unitId,
            ...msgObj,
          },
          context
        )
      )
    );
  }

  if (images.recycle.length > 0) {
    // insert deleted images to recycle
    await dynamodb.updateItem(
      tableName,
      convertKeysIn({ ...newBody, uuid: makeid(32) }, "RECYCLE", "IMG"),
      convertValuesIn({ ...newCoactKeys, images: images.recycle }, "RECYCLE"),
      {
        ...getDdbOptions(),
      }
    );
  }

  if (newBody.deleted === true) {
    await dynamodb.transaction(
      [
        {
          tableName,
          type: "Update",
          keys: convertKeysIn(
            { ...newBody, uuid: makeid(32) },
            "RECYCLE",
            "COACT"
          ),
          values: convertValuesIn(result, "RECYCLE"),
        },
        {
          tableName,
          type: "Delete",
          keys: newCoactKeys,
        },
      ],
      {
        ...getDdbOptions(),
      }
    );
  } else {
    const statsSets = {};
    const statsOperations = {};
    const statsValues = {
      ym: dayjs.tz(result.createdAt, "Asia/Seoul").format("YYYYMM"),
      sid: request.systemId,
      uid: result.assigneeId,
      category: result.category,
    };
    if (
      result.recStatus === "RELE" &&
      // outResult.recStatus !== result.recStatus &&
      result.assigneeId
    ) {
      statsValues.coactsAll = [result.id];
      statsSets.coactsAll = "string";
      statsOperations.coactsAll = result.safety === "OFF" ? "ADD" : "SUB";

      statsValues.coactsUnread = [result.id];
      statsSets.coactsUnread = "string";
      statsOperations.coactsUnread = result.safety === "OFF" ? "ADD" : "SUB";

      statsValues.coactsNotCmpl = [result.id];
      statsSets.coactsNotCmpl = "string";
      statsOperations.coactsNotCmpl = result.safety === "OFF" ? "ADD" : "SUB";
      if (result.status === "CMPL") {
        statsOperations.coactsNotCmpl = "SUB";
      }
      console.log(
        "statsOperations:",
        result.status,
        statsOperations,
        statsValues
      );
    }

    if (isTruthy(statsOperations)) {
      await dynamodb.updateItem(
        tableName,
        convertKeysIn(statsValues, "STATS"),
        convertValuesIn(statsValues, "STATS"),
        {
          ...getDdbOptions(),
          operations: statsOperations,
          sets: statsSets,
        }
      );
    }
  }

  // // status가 values.status가 있고
  // // result.status와 다를 경우 comment를 남김
  // if(values.status && values.status !== result.status){

  // }

  return result;
}
module.exports.saveCoact = saveCoact;

async function sendMessageToUser(values, context) {
  const { flow, notification, makeid } = context;

  checkRequired(values, ["uid", "sid", "pid"]);

  const tokensResult = await flow.run({
    id: "directory_v2",
    method: "GET",
    body: {
      object: "user",
      queryAppTokens: {
        sid: values.sid,
        uid: values.uid,
      },
    },
  });

  const msgId = makeid(12);

  const msgTitle = values.title,
    msgBody = values.body,
    msgData = {
      // appPage: "MainDashboardPage",
      // queryParams: JSON.stringify({
      //   category: "BBS",
      // }),
      msgId,
      appPage: "TimelinePage",
      queryParams: JSON.stringify({
        fromMyBoard: true,
        itemJson: {
          category: values.category,
          recId: values.recId,
          id: values.id,
          unitId: values.unitId,
        },
        apiResponse: {},
      }),
    };
  if (tokensResult.count > 0) {
    const result = await notification.send({
      opType: "SendMessageToMultipleDevice",
      tokens: tokensResult.list.map((each) => each.token),
      msgTitle,
      msgBody,
      msgData,
      useCustomerRole: true,
    });

    if (result.body.failedTokens.length > 0) {
      await flow.run({
        id: "directory_v2",
        method: "PUT",
        body: {
          object: "user",
          deleteAppTokens: {
            tokens: result.body.failedTokens,
          },
        },
      });
    }

    await flow.run({
      id: "directory_v2",
      method: "POST",
      body: {
        object: "notification",
        values: {
          sid: values.sid,
          pid: values.pid,
          uid: values.uid,
          uuid: msgId,
          msgTitle,
          msgBody,
          msgData,
          result: JSON.stringify(result),
        },
      },
    });
  }
}

async function saveComment(tableName, values, context, draft) {
  const { request, dynamodb, makeid } = context;

  const { LOCKKEY } = dynamodb;
  checkRequired(values, ["category"]);
  checkRequired(values, ["unitId", "recId", "coaId"]);

  let outResult = {};
  let thisIsNew = true;
  if (values.id) {
    const qResult = await dynamodb.getItem(
      tableName,
      convertKeysIn(values, "COMMENT"),
      {
        ...getDdbOptions(),
      }
    );

    if (qResult === undefined) {
      throw new Error("지정된 코멘트를 찾을수 없습니다");
    }

    if (qResult) {
      if (qResult[LOCKKEY]) {
        if (qResult[LOCKKEY] !== values[LOCKKEY]) {
          // draft.response.body = {
          //   errorMessage: `${LOCKKEY} conflicts with remote ${LOCKKEY}`,
          // };
          draft.response.headers.statusCode = 409;
          throw new Error(
            [
              "서버에 있는 데이터와 버전이 다릅니다.",
              "새로고침을 하여 최신 버전을 확인하시기 바랍니다.",
              "Provided LockKey is different with remote LockKey",
            ].join("\n")
          );
        }
      }
    }
    thisIsNew = !qResult;

    if (qResult) {
      outResult = convertItemOut(qResult);
    } else {
      outResult = values;
    }
  }

  const newBody = {
    ...values,
    uid: outResult.uid || request.userId,
    [LOCKKEY]: outResult[LOCKKEY],
    id: outResult.id || makeid(12),
    sid: outResult.sid || request.systemId,
    pid: outResult.pid || request.partnerId,
  };

  checkRequired(newBody, ["uid"]);

  const result = await dynamodb.updateItem(
    tableName,
    convertKeysIn(newBody, "COMMENT"),
    convertValuesIn(newBody, "COMMENT"),
    {
      checkLock: !thisIsNew,
      ...getDdbOptions(),
    }
  );

  const msgPushes = [];

  if (thisIsNew) {
    const thisCoact = await queryCoactById(
      tableName,
      {
        id: result.coaId,
        unitId: result.unitId,
        recId: result.recId,
      },
      context
    );
    const msgObj = {
      uid: thisCoact.uid,
      title: "안전대화에 새로운 댓글이 등록 되었습니다",
      body: "상세한 내역은 클릭하여 확인하세요",
    };
    msgPushes.push(msgObj);
  }

  if (msgPushes.length > 0) {
    await Promise.all(
      msgPushes.map((msgObj) =>
        sendMessageToUser(
          {
            sid: result.sid,
            pid: result.pid,
            category: result.category,
            recId: result.recId,
            id: result.coaId,
            unitId: result.unitId,
            ...msgObj,
          },
          context
        )
      )
    );
  }

  const comments = await queryCommentsByParent(tableName, values, context);
  // if (comments.length === 0) {
  //   console.log("result:", result);
  //   throw new Error(result);
  // }
  return comments.map(convertItemOut);
}
module.exports.saveComment = saveComment;

async function queryCommentsByParent(tableName, values, context) {
  const { request, dynamodb } = context;
  checkRequired(values, ["category", "coaId"]);
  if (["BBS", "LSC"].includes(values.category)) {
    checkRequired(values, ["unitId", "recId"]);
  }

  const newBody = {
    ...values,
    sid: request.systemId,
  };

  const pkskObjs = convertKeysToQuery(newBody, "COMMENT");

  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
  });

  return result;
}
module.exports.queryCommentsByParent = queryCommentsByParent;

async function mergeCommentsToCoact(coactList, tableName, context) {
  const { createSorter } = context;

  const promises = coactList.map(async (coa) => {
    const each = convertItemOut(coa);
    // if (!each.unitId && ["BBS", "LSC"].includes(each.category)) {
    // console.log("COACT:", each, coa);
    // }
    const comments = await queryCommentsByParent(
      tableName,
      {
        category: each.category,
        unitId: each.unitId,
        recId: each.recId,
        coaId: each.id,
      },
      context
    );

    each.comments = comments.map(convertItemOut);
    each.comments.sort(createSorter(["updatedAt"], "desc"));
    return each;
  });

  if (promises.length > 0) {
    const resultOut = await Promise.all(promises);

    return resultOut;
  } else {
    return [];
  }
}
module.exports.mergeCommentsToCoact = mergeCommentsToCoact;

async function queryCoactByUserId(tableName, values, context) {
  const { request, dynamodb } = context;

  checkRequired(values, ["uid"]);

  const newBody = {
    ...values,
    // uid: request.userId,
    sid: request.systemId,
  };

  const filters = {};

  if (values.safety === "ON") {
    filters.safety = {
      operation: "=",
      value: values.safety,
    };
  } else {
    filters.safety = {
      operation: "<>",
      value: "ON",
    };
  }

  const pkskObjs = convertKeysToQuery(newBody, "COACT");
  console.log("pkskObjs:", JSON.stringify(pkskObjs));

  const results = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
    filters,
  });

  if (values.includeComments === true) {
    const coactsWithComments = await mergeCommentsToCoact(
      results,
      tableName,
      context
    );
    return mergeItemToCoact(tableName, { list: coactsWithComments }, context);
  }

  return mergeItemToCoact(tableName, { list: results }, context);
}
module.exports.queryCoactByUserId = queryCoactByUserId;

async function mergeItemToCoact(tableName, result, context) {
  if (result.list.length === 0) {
    return result;
  }

  const unitSet = new Set();
  result.list.forEach((each) => {
    unitSet.add(each.unitId);
  });

  const itemsMap = {};
  const unitsMap = {};

  const unitIds = Array.from(unitSet).filter(Boolean);

  if (unitIds.length > 0) {
    await Promise.all(
      unitIds.map(async (eachUid) => {
        const unitData = await queryUnitById(
          tableName,
          { id: eachUid },
          context
        );
        unitsMap[eachUid] = { ...unitData };
        delete unitsMap[eachUid].items;
        unitsMap[eachUid] = convertItemOut(unitsMap[eachUid]);

        unitData.items.forEach((item) => {
          itemsMap[[item.unitId, item.id].join("-")] = convertItemOut(item);
        });
      })
    );
  }

  result.items = itemsMap;
  result.units = unitsMap;

  return mergeUserToCoact(tableName, result, context);
  // result.list.forEach((each) => {
  //   each.item = itemsMap[[each.unitId, each.itemId].join("-")];
  // });

  // return mergeUserToCoact(tableName, result, context);
}
module.exports.mergeItemToCoact = mergeItemToCoact;

async function mergeUserToCoact(tableName, result, context) {
  if (result.list.length === 0) {
    return result;
  }

  const { request, flow } = context;

  // collect all user ids
  const uidSet = new Set();
  result.list.forEach((each) => {
    if (each.assigneeType === "user") {
      uidSet.add(each.assigneeId);
    }
    uidSet.add(each.uid);
    each.comments &&
      each.comments.forEach((com) => {
        uidSet.add(com.uid);
      });
  });

  // console.log("users to query:", Array.from(uidSet).filter(Boolean));
  const userIds = Array.from(uidSet).filter(Boolean);
  if (userIds.length > 0) {
    // batch get item from db
    const usersResult = await flow.run({
      id: "directory_v2",
      method: "GET",
      body: {
        object: "user",
        queryByIds: {
          sid: request.systemId,
          uid: userIds,
        },
      },
    });
    // console.log("usersResult:", usersResult, JSON.stringify(usersResult));
    const itemsMap = usersResult.list.reduce((acc, each) => {
      const outEach = convertItemOut(each);
      acc[outEach.uid] = outEach;
      return acc;
    }, {});

    result.users = itemsMap;
  } else {
    result.users = {};
  }

  // collect all group ids
  const groupIdSet = new Set();
  result.list.forEach((coa) => {
    if (coa.assigneeType === "group") {
      groupIdSet.add(coa.assigneeId);
    }
  });
  Object.keys(result.users).forEach((key) => {
    const user = result.users[key];
    if (user.relations) {
      user.relations.forEach((rel) => {
        groupIdSet.add(rel.gid);
      });
    }
  });
  const groupIds = Array.from(groupIdSet).filter(Boolean);

  if (groupIds.length > 0) {
    // batch get item from db
    const groupsResult = await flow.run({
      id: "directory_v2",
      method: "GET",
      body: {
        object: "group",
        queryByIds: {
          // pid: request.partnerId,
          sid: request.systemId,
          gid: groupIds,
        },
      },
    });
    const groups = groupsResult.list.reduce((acc, each) => {
      const outEach = convertItemOut(each);
      acc[outEach.gid] = outEach;
      return acc;
    }, {});

    result.groups = groups;
  } else {
    result.groups = {};
  }

  return result;
}
module.exports.mergeUserToCoact = mergeUserToCoact;

async function queryCoactByQueryLimit(tableName, values, context) {
  const { dynamodb, request, flow } = context;

  const newBody = {
    sid: request.systemId,
  };

  const filters = {};
  if (values.toMe === true) {
    if (values.includeHigher === true) {
      const userResult = await flow.run({
        id: "directory_v2",
        method: "GET",
        body: {
          object: "user",
          queryById: {
            sid: request.systemId,
            uid: request.userId,
          },
        },
      });

      const groupIdSet = new Set();
      userResult.list.forEach((user) => {
        user.relations.forEach((rel) => {
          groupIdSet.add(rel.gid);
        });
      });

      const userIdList = [];

      const promises = Array.from(groupIdSet).map(async (gid) => {
        const result = await flow.run({
          id: "directory_v2",
          method: "GET",
          body: {
            object: "group",
            queryById: {
              pid: request.partnerId,
              sid: request.systemId,
              gid,
              IncludeHigherLevels: true,
              IncludeUsers: true,
              ExcludeGrand: true,
            },
          },
        });

        result.list.forEach((group) => {
          group.users.forEach((user) => {
            userIdList.push(user.uid);
          });
        });
      });

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      const userIdSet = new Set();
      userIdList.forEach((uid) => {
        userIdSet.add(uid);
      });

      filters.assigneeId = {
        operation: "in",
        value: Array.from(userIdSet),
      };
    } else {
      filters.assigneeId = {
        operation: "=",
        value: request.userId,
      };
    }
  }

  if (values.safety === "ON") {
    filters.safety = {
      operation: "=",
      value: values.safety,
    };
  } else {
    filters.safety = {
      operation: "<>",
      value: "ON",
    };
  }

  const pkskObjs = [
    {
      pkid: `COACT:SYS#${newBody.sid}`,
    },
    {},
  ];

  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: "pkid-updatedAt-index",
    ...getDdbOptions(),
    sortOrder: "desc",
    limitCount: 50,
    filters,
  });

  return mergeItemToCoact(tableName, result, context);
}
module.exports.queryCoactByQueryLimit = queryCoactByQueryLimit;

async function queryCoactBySearch(tableName, values, context) {
  const { request, dynamodb, flow, dayjs } = context;

  checkRequired(values, ["updatedAtFrom", "updatedAtTo"]);

  const newUpdatedAtFrom = dayjs
    .tz(values.updatedAtFrom, "YYYY-MM-DD", "Asia/Seoul")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  const newUpdatedAtTo = dayjs
    .tz(values.updatedAtTo, "YYYY-MM-DD", "Asia/Seoul")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const newBody = {
    ...values,
    sid: request.systemId,
  };
  newBody.updatedAtFrom = newUpdatedAtFrom;
  newBody.updatedAtTo = newUpdatedAtTo;

  const filters = {};
  if (values.unitId) {
    filters.unitId = {
      operation: "=",
      value: values.unitId,
    };
  }
  if (values.itemId) {
    filters.itemId = {
      operation: "=",
      value: values.itemId,
    };
  }

  const userIdSet = new Set();
  if (values.uid) {
    userIdSet.add(values.uid);
  } else if (values.gid) {
    const result = await flow.run({
      id: "directory_v2",
      method: "GET",
      body: {
        object: "group",
        queryById: {
          // pid: request.partnerId,
          sid: request.systemId,
          gid: values.gid,
          IncludeLowerLevels: true,
          IncludeUsers: true,
        },
      },
    });
    result.list.forEach((group) => {
      group.users.forEach((user) => {
        userIdSet.add(user.uid);
      });
    });
  } else {
    const pkskObjs = convertKeysToQuery(newBody, "COACT");

    const result = await dynamodb.query(tableName, ...pkskObjs, {
      indexName: getIndexName(pkskObjs),
      sortOrder: "desc",
      ...getDdbOptions(),
      filters,
    });

    // return mergeItemToCoact(tableName, { list: result }, context);
    return result;
  }

  const userIds = Array.from(userIdSet);

  if (userIds.length === 0) {
    return [];
  } else {
    const finalResult = [];
    for (const uid of userIds) {
      newBody.uid = uid;
      delete newBody.gid;

      const pkskObjs = convertKeysToQuery(newBody, "COACT");

      const result = await dynamodb.query(tableName, ...pkskObjs, {
        indexName: getIndexName(pkskObjs),
        sortOrder: "desc",
        ...getDdbOptions(),
        filters,
      });

      result.forEach((each) => {
        finalResult.push(each);
      });
    }

    // return mergeItemToCoact(tableName, { list: finalResult }, context);
    return finalResult;
  }
}
module.exports.queryCoactBySearch = queryCoactBySearch;

async function queryCoactByRecId(tableName, values, context) {
  const { request, dynamodb } = context;

  checkRequired(values, ["recId", "unitId", "category"]);

  const newBody = {
    ...values,
    uid: request.userId,
    sid: request.systemId,
  };

  const pkskObjs = convertKeysToQuery(newBody, "COACT");
  console.log("pkskObjs:", pkskObjs, newBody);

  const result = await dynamodb.query(tableName, ...pkskObjs, {
    indexName: getIndexName(pkskObjs),
    ...getDdbOptions(),
  });

  // result.forEach((each) => {
  //   if (each.images && values.excludeDeletedImage === true) {
  //     each.images = each.images.filter((img) => img.deleted !== true);
  //   }
  // });

  return mergeItemToCoact(tableName, { list: result }, context);
}
module.exports.queryCoactByRecId = queryCoactByRecId;

async function migrateCoact(tableName, context) {
  const { request, dynamodb } = context;

  const pkskObjs = convertKeysToQuery(
    { sid: request.systemId, uid: "test" },
    "COACT"
  );

  const results = await dynamodb.query(
    tableName,
    pkskObjs[0],
    {},
    {
      ...getDdbOptions(),
    }
  );

  await Promise.all(
    results.map(async (each) => {
      const newData = {
        ...each,
      };
      if (newData.assigneeId && !newData.assigneeType) {
        newData.assigneeId = "";
      }
      if (newData.safety === false || newData.safety === "") {
        newData.safety = "OFF";
      }
      const sets = {};
      if (newData.likers) {
        sets.likers = "string";
      }
      const result = await dynamodb.updateItem(
        tableName,
        convertKeysIn(newData, "COACT"),
        convertValuesIn(newData, "COACT"),
        {
          ...getDdbOptions(),
          sets,
        }
      );
      if (result.skid !== newData.skid) {
        await dynamodb.deleteItem(
          tableName,
          {
            pkid: newData.pkid,
            skid: newData.skid,
          },
          {
            ...getDdbOptions(),
          }
        );
      }
    })
  );

  return results.length;
}
module.exports.migrateCoact = migrateCoact;

async function getUploadUrl(values, context) {
  const { request, getUploadUrlViaProxy, makeid, kst, tryit } = context;
  const imgId = makeid(10);
  const result = await getUploadUrlViaProxy({
    configKey: "Impactus_Image",
    pathVariables: {
      partner_id: request.partnerId,
      system_id: request.systemId,
      year: kst.format("yyyy"),
      month: kst.format("MM"),
      mon_cat: values.category,
      mon_id: values.unitId,
      rec_id: values.id,
      uuid: imgId,
      fileExtension:
        tryit(() =>
          values.fileName.match(/\.[0-9a-z]+$/i)[0].replace(".", "")
        ) || "unknown",
    },
    contentType: values.contentType,
  });

  return {
    ...result,
    id: imgId,
  };
}
module.exports.getUploadUrl = getUploadUrl;
