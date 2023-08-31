module.exports.fetchAll = async (odata, { url, username, password }) => {
  // url에 skip이 들어가 있으면 안됨, $top이 있어도 전체 data를 받아옴
  const getData = (skip = 0) =>
    odata.get({ url: `${url}&$skip=${skip}`, username, password });
  try {
    const fetchData = await getData();
    if (Number(fetchData.d.__count) === fetchData.d.results.length) {
      return { result: fetchData.d.results };
    } else {
      const data = fetchData.d.results;
      while (data.length < Number(fetchData.d.__count)) {
        const reFetchData = await getData(data.length);
        data.push(...reFetchData.d.results);
      }
      return { result: data };
    }
  } catch (error) {
    return { errorMsg: error.message, result: [], url };
  }
};
