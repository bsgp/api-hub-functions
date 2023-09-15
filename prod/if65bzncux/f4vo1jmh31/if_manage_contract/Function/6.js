module.exports = async (draft, { fn, sql }) => {
  const { tables, newData } = draft.json;
  const contract = fn.getDB_Object(newData, "contract");

  const builder = sql("mysql");
  const contractValidator = await builder.validator;

  draft.response.body = {
    table: tables.contract.name,
    contract,
    builder,
    contractValidator,
  };
  // if (!contractValidator(contract).isValid) {
  //   draft.response.body = {
  //     E_STATUS: "F",
  //     E_MESSAGE: "Valid falied",
  //   };
  //   return;
  // }

  // const createContract = await builder
  //   .insert(tables.contract.name, contract)
  //   .run();
  // if (createContract.statusCode === 200) {
  //   draft.response.body = {
  //     E_STATUS: "S",
  //     E_MESSAGE: "contract insert successfully",
  //     createContract,
  //   };
  // } else {
  //   draft.response.body = {
  //     E_STATUS: "F",
  //     E_MESSAGE: `Failed save ${tables.contract.name}`,
  //     createContract,
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // const ref_doc = [];
  // const cost_object = [];
  // const bill = [];
  // const party = [];

  // draft.response.body = {
  //   E_STATUS: "S",
  //   E_MESSAGE: "TEST",
  //   ...draft.response.body,
  //   request_contractID: draft.json.newData.contractID,
  //   tables: draft.json.tables,
  //   contract: {
  //     type: "P",
  //     contractID: "7775577",
  //     partyList: [],
  //     costObjectList: [],
  //     billList: [],
  //     attachmentList: [],
  //   },
  // };
};
