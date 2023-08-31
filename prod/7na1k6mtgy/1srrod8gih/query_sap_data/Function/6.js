module.exports = async (draft, { request }) => {
  const { list } = draft.response.body;
  const expectedColumns = request.body.Columns || [];

  const keyCols = list.filter((col) => col.keyFlag);
  const keyLength = keyCols.reduce((acc, col) => acc + col.length + 1, 0);

  draft.json.keyFields = keyCols;
  console.log("column list:", JSON.stringify(list));
  draft.json.fieldGroups = list
    .filter((col) => {
      if (col.keyFlag) {
        return true;
      }
      if ([".INCLU--AP", ".INCLUDE"].includes(col.fieldName)) {
        return false;
      }
      if (expectedColumns.length > 0) {
        return expectedColumns.includes(col.fieldName);
      }
      return true;
    })
    .reduce(
      (acc, field) => {
        if (acc.total + field.length + 1 > 512) {
          acc["total" + acc.index] = acc.total;
          acc["length" + acc.index] = acc.list[acc.index].length;
          acc.total = keyLength;
          acc.index += 1;
          // if(idx < lastIndex){
          acc.list[acc.index] = [...keyCols];
          // }
        }

        acc.list[acc.index].push(field);
        acc.total += field.length + 1;
        // switch (field.dataType) {
        //   case "FLTP":
        //     acc.total += 1;
        //     break;
        //   case "CURR":
        //     acc.total += 2;
        //     break;
        //   default:
        //     break;
        // }

        return acc;
      },
      { list: [[]], total: 0, index: 0, count: list.length }
    );

  draft.response.body = draft.json.fieldGroups;
};
