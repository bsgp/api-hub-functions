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

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD", hour = 9) => {
  if (!dateStr) {
    return "";
  }
  let date;
  if (typeof dateStr === "string") {
    if (/^\d{1,}$/.test(dateStr)) {
      date = dateStr;
    } else {
      const numberString = dateStr.replace(/^\/Date\(/, "").replace(")/", "");
      if (/^\d{1,}$/.test(numberString)) {
        date = new Date(parseInt(numberString, 10));
      } else date = numberString;
    }
  }
  return dayjs(date).add(hour, "hour").format(format);
};

module.exports.convDate = convDate;

const stockPrefix = (currentDate) => {
  const pYear = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const pMonth = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const yymm = currentDate.split("-");
  return `${pYear[yymm[0] % 10]}${pMonth[Number(yymm[1] - 1)]}`;
};

module.exports.getLastIStockParams = (YYMM) => {
  const $filter = `ID eq '${stockPrefix(YYMM)}????'`;
  return { $filter, $select: "ID", $orderby: "ID desc", $top: 10 };
};

module.exports.stockNumber = (intValue, YYMM) => {
  if (intValue > 65535) {
    // Max number of of four digits Hexadecimal
    throw new Error("stockNumber exceed max value of four digits hexadecimal");
  }
  const hexNumber = intValue.toString(16).toUpperCase();
  return stockPrefix(YYMM) + ("0000" + hexNumber).substr(-4, 4);
};
