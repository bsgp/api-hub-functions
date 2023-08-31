module.exports = async (draft, { soap }) => {
  const exchange = draft.pipe.json.exchange;
  const ExchangeRate = exchange.ExchangeRate;
  const wsdlAlias = "wsdl1";
  const certAlias = "test2";
  const payload = { BasicMessageHeader: {}, ExchangeRate };
  draft.response.body.push(payload);
  if (ExchangeRate.length > 0) {
    let result;
    try {
      result = await soap(`manage_exchange_rate_in:${wsdlAlias}`, {
        p12ID: `bsgtest:${certAlias}`,
        operation: "MaintainBundle",
        payload,
      });
      if (result.statusCode === 200) {
        const body = JSON.parse(result.body);
        draft.response.body.push({ statusCode: result.statusCode, body });
      } else throw new Error("soap failed");
    } catch (error) {
      draft.response.body.push(error);
      draft.response.body.push(result);
    }
  }
};
