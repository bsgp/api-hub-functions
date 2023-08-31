module.exports = async (draft) => {
  const searchType = draft.json.searchType;
  switch (searchType) {
    case "shippingDate": {
      await wait(30000);
      break;
    }
    case "productionDate": {
      await wait(60000);
      break;
    }
    default:
      break;
  }
};

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
