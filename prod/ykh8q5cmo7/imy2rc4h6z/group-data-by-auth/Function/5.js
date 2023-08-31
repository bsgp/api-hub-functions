module.exports = async (draft, { request, sql }) => {
  const { user, tables } = draft.pipe.json;

  const gmember = getTableByIndicator("gmember");
  const gheader = getTableByIndicator("gheader");
  const gmeta = getTableByIndicator("gmeta");

  const myGroups = await sql("mysql")
    .select(gmember, [`${gheader}.ID`, `${gheader}.LOWER`, `${gheader}.UPPER`])
    .join(gheader, `${gheader}.ID`, `${gmember}.GROUP_ID`)
    .where(
      Object.fromEntries([
        ["USER_ID", user],
        [`${gheader}.DELETED`, false],
        [`${gmember}.DELETED`, false]
      ])
    )
    .run();

  const strangerIDs = getStrangerIDs(myGroups.body.list);
  const wholeIDs = myGroups.body.list.map(({ ID }) => ID).concat(strangerIDs);

  const wholeGroups = await sql("mysql")
    .select(gheader)
    .whereIn(`${gheader}.ID`, wholeIDs)
    .join(gmember, `${gheader}.ID`, `${gmember}.GROUP_ID`)
    .join(gmeta, `${gheader}.ID`, `${gmeta}.GROUP_ID`)
    .run();

  draft.response = wholeGroups;

  // const { user, tables } = draft.pipe.json;
  // const myGrpMembers = await sql("mysql")
  //   .select(getTableByIndicator("gmember"))
  //   .where({ USER_ID: user })
  //   .andWhere(getNotDeleted)
  //   .run();
  // const relatedIDs = myGrpMembers.body.list.map(({ GROUP_ID }) => GROUP_ID);
  // const grpDels = await sql("mysql")
  //   .select(getTableByIndicator("gdeleted"))
  //   .whereIn("GROUP_ID", relatedIDs)
  //   .andWhere(getNotDeleted)
  //   .run();
  // const removedIDs = grpDels.body.list.map(({ GROUP_ID }) => GROUP_ID);
  // const notRemovedIDs = relatedIDs.filter(id => !removedIDs.includes(id));
  // const myGrpHeaders = await sql("mysql")
  //   .select(getTableByIndicator("gheader"))
  //   .whereIn("ID", notRemovedIDs)
  //   .andWhere(getNotDeleted)
  //   .run();
  // const strangerIDs = getStrangerIDs(myGrpHeaders.body.list);
  // const otherGrpHeaders = await sql("mysql")
  //   .select(getTableByIndicator("gheader"))
  //   .whereIn("ID", strangerIDs)
  //   .andWhere(getNotDeleted)
  //   .run();
  // const wholeIDs = myGrpHeaders.body.list
  //   .map(({ ID }) => ID)
  //   .concat(otherGrpHeaders.body.list.map(({ ID }) => ID));
  // const getGrpMetas = sql("mysql")
  //   .select(getTableByIndicator("gmeta"))
  //   .whereIn("GROUP_ID", wholeIDs)
  //   .andWhere(getNotDeleted).run;
  // const getWholeGrpMembers = sql("mysql")
  //   .select(getTableByIndicator("gmember"))
  //   .whereIn("GROUP_ID", wholeIDs)
  //   .andWhere(getNotDeleted).run;
  // const [grpMetas, wholeGrpMembers, left] = await Promise.all([
  //   getGrpMetas(),
  //   getWholeGrpMembers(),
  //   getLeft()
  // ]);
  // const { grpItems, jobHeaders } = left;
  // draft.response.statusCode = 200;
  // draft.response.body = {
  //   gmember: wholeGrpMembers.body,
  //   gdeleted: grpDels.body,
  //   gheader: {
  //     count: myGrpHeaders.body.count + otherGrpHeaders.body.count,
  //     list: myGrpHeaders.body.list.concat(otherGrpHeaders.body.list)
  //   },
  //   gmeta: grpMetas.body,
  //   gitem: grpItems.body,
  //   jheader: jobHeaders.body
  // };

  /* tools */
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder, column = "") {
    return builder.whereNull(`${column}.DELETED`).orWhere({ DELETED: false });
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
   
  // async function getLeft() {
  //   const grpItems = await sql("mysql")
  //     .select(getTableByIndicator("gitem"))
  //     .whereIn("GROUP_ID", wholeIDs)
  //     .andWhere(getNotDeleted)
  //     .run();
  //   const jobIDs = grpItems.body.list.map(({ JOB_ID }) => JOB_ID);
  //   const jobHeaders = await sql("mysql")
  //     .select(getTableByIndicator("jheader"))
  //     .where(function() {
  //       this.where({ USER_ID: user }).orWhereIn("JOB_ID", jobIDs);
  //     })
  //     .andWhere(getNotDeleted)
  //     .run();
  //   return { grpItems, jobHeaders };
  // }
};
