module.exports = async (draft, { request }) => {
  if (request.body.Function.Type === "API") {
    const params = new URLSearchParams();
    Object.keys(request.body.Data).forEach((key) => {
      params.set(key, request.body.Data[key]);
    });
    // params.set("I_BUKRS", "2000");
    // params.set("I_DATE_FROM", "20220901");
    // params.set("I_DATE_TO", "20220930");
    // params.set("I_DCTYP", "BZM02");

    draft.json.queryString = params.toString();
  }

  // switch (request.body.InterfaceId) {
  //   case "IF-FI-BZM01":
  //   case "IF-FI-BZM02":
  //     draft.json.nextNodeKey = "Function#7";
  //     break;
  //   default: {
  //     //
  //     break;
  //   }
  // }
};
