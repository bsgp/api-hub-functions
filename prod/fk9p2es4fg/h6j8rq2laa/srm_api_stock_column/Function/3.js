module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "",
    optionalColumns: [
      { id: "productID", text: "제품 ID" },
      { id: "productText", text: "제품 내역" },
      // { id: "iStockID", text: "동종재고 ID" },
      // {
      //   id: "expireDate",
      //   text: "만료일",
      //   component: "Date",
      // },
      { id: "logisticAreaID", text: "물류영역 ID" },
      { id: "logisticAreaText", text: "물류영역 내역" },
      // { id: "restricted", text: "제한", component: "CheckBox" },
      // { id: "inspectionStock", text: "검사", component: "CheckBox" },
      { id: "quantity", text: "수량", component: "Quantity" },
    ],
  };
};
