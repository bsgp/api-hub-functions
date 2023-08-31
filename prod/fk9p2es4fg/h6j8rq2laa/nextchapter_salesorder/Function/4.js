module.exports = async (draft, { file }) => {
  const orders = draft.json.response.orders;
  if (!orders || orders.length === 0) {
    return;
  }
  for (let idx = 0; idx < orders.length; idx++) {
    const order = orders[idx];
    const id = order.id;
    await file.upload(`so/${id}.json`, order);
  }
  draft.response.body = {
    ...draft.response.body,
    E_STATUS: "S",
    E_MESSAGE: "Get N.C Data Sussessfully",
  };
};
