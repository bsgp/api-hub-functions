module.exports = async (draft, { request, file }) => {
  const ifList = await file.get("if/list.json", {
    gziped: true,
    toJSON: true,
  });

  const ifIdList = Object.keys(ifList);
  draft.json.interfaceList = ifIdList
    .filter((ifId) =>
      request.body.IfList ? request.body.IfList.includes(ifId) : true
    )
    .reduce((acc, ifId) => {
      acc.push({
        InterfaceId: ifId,
        ...ifList[ifId],
      });
      return acc;
    }, []);

  draft.json.finalBody = {
    list: [],
  };

  // for(let idx = 0; idx < ifIdList.length; idx += 1){
  //   const ifId = ifIdList[idx];

  // }
};
