module.exports = async (draft, { request }) => {
  const routeTo = {
    exit: "Output#2",
    select: "Function#4",
    delete: "Function#5",
  };

  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const tableName = "CMS_CORP_CARD_01";
  const primaryKeys = ["CARD_NUMBER", "USAGE_DATE_FROM"];
  const otherKeys = [
    "CARD_CLASSIFICATION",
    "CSV_CODE",
    "CARD_OWNER",
    "CARD_USER_DEPT",
    "PASSWORD",
    "LIMIT_OF_USE",
    "CARD_USER_ID",
    "USAGE_STATUS",
    "CARD_VALID_UNTIL",
    "USAGE_DATE_TO",
    "DESCRIPTION",
  ];

  draft.json.tableConfig = {
    tableName,
    primaryKeys,
    otherKeys,
    orderBy: [{ column: "CARD_NUMBER" }, { column: "USAGE_DATE_FROM" }],
  };

  switch (request.method) {
    case "GET": {
      draft.json.selectQuery = {
        where: { ...request.body },
      };
      draft.json.nextNodeKey = routeTo.select;
      break;
    }
    case "POST": {
      const { added, updated, deleted } = request.body;
      if (
        !Array.isArray(added) ||
        !Array.isArray(updated) ||
        !Array.isArray(deleted)
      ) {
        setFailedResponse("All values must be an array type");
        return;
      }
      if (added.length === 0 && updated.length === 0 && deleted.length === 0) {
        setFailedResponse("All values are empty");
        return;
      }

      const asyncResultList = await Promise.all([
        getTrimmedObjectList("added_trimmed", added, [
          "CARD_NUMBER",
          "USAGE_DATE_FROM",
          "CARD_USER_ID",
        ]),
        getTrimmedObjectList("updated_trimmed", updated, primaryKeys),
        getTrimmedObjectList("deleted_trimmed", deleted, primaryKeys),
      ]);
      let modifiedData = {
        added,
        updated,
        deleted,
      };
      asyncResultList.forEach((rowObj) => {
        modifiedData = { ...modifiedData, ...rowObj };
      });

      draft.json.modifiedData = modifiedData;
      draft.json.nextNodeKey = routeTo.delete;

      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: {},
      };

      // draft.response.body = modifiedData;
      // draft.json.nextNodeKey = routeTo.exit;

      break;
    }
    default: {
      setFailedResponse("Not available method");
    }
  }
};

// Object 리스트에서 주어진 key에 맞게 trim 시키는 함수
async function getTrimmedObjectList(tagName, list, primaryKeys) {
  if (!Array.isArray(list) || list.length === 0) {
    const result = {};
    result[tagName] = [];
    return result;
  }

  list = list.filter((item) => primaryKeys.every((key) => item[key]));

  function hasSameOnResult(result = [], itemToPush = {}) {
    return result.some((resItem) =>
      primaryKeys.every((key) => itemToPush[key] === resItem[key])
    );
  }

  async function getMergedArray(left = [], right = []) {
    if (left.length === 0) {
      return right.length > 0 ? right : [];
    }
    if (right.length === 0) {
      return left.length > 0 ? left : [];
    }

    const itemsLeft = await getMergedArray(
      left.slice(0, Number.parseInt(left.length / 2)),
      left.slice(Number.parseInt(left.length / 2))
    );
    const itemsRight = await getMergedArray(
      right.slice(0, Number.parseInt(right.length / 2)),
      right.slice(Number.parseInt(right.length / 2))
    );

    const result = [];
    while (itemsLeft.length > 0 || itemsRight.length > 0) {
      if (itemsLeft.length === 0) {
        const itemToPush = itemsRight.pop();
        if (!hasSameOnResult(result, itemToPush)) {
          result.push(itemToPush);
        }
      } else if (itemsRight.length === 0) {
        const itemToPush = itemsLeft.pop();
        if (!hasSameOnResult(result, itemToPush)) {
          result.push(itemToPush);
        }
      } else {
        const lastItemLeft = itemsLeft.pop();
        const lastItemRight = itemsRight.pop();

        const isBothSame = primaryKeys.every(
          (key) => lastItemLeft[key] === lastItemRight[key]
        );
        const buffArr = isBothSame
          ? [lastItemLeft]
          : [lastItemLeft, lastItemRight];

        buffArr.forEach((itemToPush) => {
          if (!hasSameOnResult(result, itemToPush)) {
            result.push(itemToPush);
          }
        });
      }
    }

    return result;
  }

  const trimmed = await getMergedArray(
    list.slice(0, Number.parseInt(list.length / 2)),
    list.slice(Number.parseInt(list.length / 2))
  );

  const resultArr = [];
  trimmed.forEach((item) => {
    const itemToPush = {};
    primaryKeys.forEach((keyName) => {
      itemToPush[keyName] = item[keyName];
    });
    resultArr.push(itemToPush);
  });

  const result = {};
  result[tagName] = resultArr;
  return result;
}
