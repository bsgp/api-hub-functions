module.exports = async (draft, { sql }) => {
  const { user, tables } = draft.pipe.json;

  const { gmember, gheader, gmeta } = getTableNameByConfig();

  const myGroups = await sql("mysql")
    .select(gmember, [
      `${gheader}.ID`,
      `${gheader}.LOWER`,
      `${gheader}.UPPER`,
      `${gmember}.TYPE_ID`
    ])
    .join(gheader, `${gmember}.GROUP_ID`, `${gheader}.ID`)
    .where(`${gmember}.USER_ID`, user)
    .andWhere(notDeleted([gmember, gheader]))
    .run();

  const strangerIDs = getStrangerIDs(myGroups.body.list);
  const wholeIDs = myGroups.body.list.map(({ ID }) => ID).concat(strangerIDs);

  const metaWritten = await sql("mysql")
    .select(gmeta)
    .whereIn("GROUP_ID", wholeIDs)
    .andWhere(notDeleted(gmeta))
    .run();

  const targetColumns = {
    id: `${gheader}.ID`,
    name: `${gheader}.NAME`,
    owner: `${gmember}.USER_ID`,
    level: `${gheader}.LEVEL`,
    draft: `${gheader}.DRAFT`,
    lower: `${gheader}.LOWER`,
    upper: `${gheader}.UPPER`
  };

  const result = await sql("mysql")
    .select(gheader, targetColumns)
    .join(gmember, `${gheader}.ID`, `${gmember}.GROUP_ID`)
    .whereIn(`${gheader}.ID`, wholeIDs)
    .andWhere(`${gmember}.TYPE_ID`, "owner")
    .andWhere(notDeleted([gmember, gheader]))
    .run();

  draft.response.statusCode = 200;
  draft.response.body = dataToTree(result.body.list);

  /* tools */
  function notDeleted(fields) {
    if (Array.isArray(fields)) {
      return Object.fromEntries(
        fields.map(field => [`${field}.DELETED`, false])
      );
    }
    return Object.fromEntries([[`${fields}.DELETED`, false]]);
  }

  function getTableNameByConfig() {
    const data = Object.entries(tables).map(([indicator, obj]) => [
      indicator,
      obj.name
    ]);
    return Object.fromEntries(data);
  }

  function getStrangerIDs(headerBody) {
    return headerBody
      .map(({ LOWER, UPPER }) => [LOWER, UPPER].join(":").split(":"))
      .reduce((acc, cur) => acc.concat(cur), [])
      .filter(path => path !== "")
      .reduce((acc, cur) => acc.concat(cur.split("/")), [])
      .reduce((acc, cur) => {
        if (!acc.includes(cur)) acc.push(cur);
        return acc;
      }, [])
      .filter(targetID => !headerBody.find(({ ID }) => ID === targetID));
  }

  function dataToTree(data) {
    const tops = data
      .filter(({ lower, upper }) => lower !== "" && upper === "")
      .map(mapper);

    const rels = data.reduce((acc, { id, upper, lower, ...rest }) => {
      if (upper !== "") {
        const upperIDs = upper.split("/");
        const upperID = upperIDs[upperIDs.length - 1];
        acc.push({ upperID, id, ...rest });
      }
      return acc;
    }, []);

    const recursion = branch => {
      const leafs = rels.filter(rel => rel.upperID === branch.id).map(mapper);
      branch.sub = leafs;
      leafs.forEach(recursion);
    };
    tops.forEach(recursion);

    const noRelData = data
      .filter(({ upper, lower }) => upper === "" && lower === "")
      .map(mapper);

    const tree = tops.concat(noRelData);
    return { sub: tree };
  }

  function mapper({ id, name, owner, level, draft: aDraft }) {
    const alpha = myGroups.body.list
      .filter(({ TYPE_ID }) => TYPE_ID !== "owner")
      .find(item => id === item.ID);
    const data1 = alpha ? { assigned: alpha.TYPE_ID } : {};
    const bravo = metaWritten.body.list.find(({ GROUP_ID }) => id === GROUP_ID);
    const draft = (() => {
      if (!bravo) return "미작성";
      if (aDraft) return "임시 저장";
      return "완료";
    })();
    return { id, name, owner, level, draft, ...data1, sub: [] };
  }
};
