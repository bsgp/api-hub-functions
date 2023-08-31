module.exports = async (draft, { request, fn, file }) => {
  const getData = async (path) => {
    try {
      const data = await file.get(path);
      return JSON.parse(data) || {};
    } catch (error) {
      return undefined;
    }
  };
  const path = fn.getKey({
    flowID: "get_confirmationjournal",
    id: draft.json.uploadKeys[draft.json.resCount],
    dateArr: request.requestTime,
  });
  const fetchData = await getData(path);
  if (!fetchData) {
    let tryIndicator = true;
    let reTryCount = 0;

    while (tryIndicator || reTryCount < 5) {
      await wait(5000);
      try {
        const reFetchData = await getData(path);
        if (reFetchData) {
          tryIndicator = false;
          const confirmationJournal =
            (reFetchData && reFetchData.confirmationJournal) || [];
          draft.json.uploadKeyData.push({ path, confirmationJournal });
          draft.json.resCount = draft.json.resCount + 1;
        } else reTryCount++;
        return;
      } catch (err) {
        tryIndicator = false;
        const confirmationJournal = [];
        draft.json.uploadKeyData.push({ path, confirmationJournal });
        draft.json.resCount = draft.json.resCount + 1;
      }
    }
  } else {
    const confirmationJournal =
      (fetchData && fetchData.confirmationJournal) || [];
    draft.json.uploadKeyData.push({ path, confirmationJournal });
    draft.json.resCount = draft.json.resCount + 1;
  }
};

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
