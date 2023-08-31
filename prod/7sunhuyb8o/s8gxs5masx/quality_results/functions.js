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

module.exports.getChunks = (array = []) => {
  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};

module.exports.getQualityResultParams = ({ params }) => {
  return {
    "sap-language": "ko",
    $top: "500",
    $format: "json",
    $inlinecount: "allpages",
    $filter: params.filter.list.join(" and "),
    $select: [
      "CMOVE_DIRECTION", // 이동 방향
      "TMOVE_DIRECTION",
      "CBT_POSTING_DATE",
      "CCONF_ID", // 확인 ID
      "CCANC_ID",
      "CITEM_ID",
      "C1N6061KGKRRDY27JVXB8IBB48I", // 무검사
      "C1H4ROBQ2CJYN7HZXJJXDQ9N3TM", // 품질명칭
      "C1PUM32FIIWRGVQAF4BD5HUK4HA", // FULL NAME
      "CSITE_UUID", // 사이트 ID
      "TSITE_UUID", // 사이트 ID
      "CMATERIAL_UUID", // 제품 ID
      "TMATERIAL_UUID", // 제품 ID
      "CISTOCK_UUID", // 동종 재고 ID
      "TISTOCK_UUID", // 동종 재고 ID
      "CCATCP_UUID", // 범주 ID
      "TCATCP_UUID", // 범주 ID
      "CREF_MST_ID", // 원본 문서 ID
      "CREF_ID", // 참조 문서 ID
      "CREF_MST_TYPE", // 원본 문서 유형
      "CREF_TYPE", // 참조 문서 유형
      "KCINV_QUAN_NORMAL", // 유효수량
      "UCINV_QUAN_NORMAL", // 유효수량
    ],
  };
};

module.exports.convOut = (list, dayjs) => {
  return list
    .filter((cf) => !cf.CCANC_ID)
    .map((cf) => {
      const documentID = (() => {
        switch (cf.CREF_MST_TYPE) {
          case "001":
          case "814":
            return cf.CREF_MST_ID;
          default:
            if (cf.CREF_TYPE === "96") {
              return cf.CREF_ID;
            }
            break;
        }
      })();

      return {
        confID: cf.CCONF_ID,
        confItemID: cf.CITEM_ID,
        confType: cf.CCONF_TYPE,
        siteID: cf.CSITE_UUID,
        siteText: cf.TSITE_UUID,
        materialID: cf.CMATERIAL_UUID,
        materialText: cf.TMATERIAL_UUID,
        iStockID: cf.CISTOCK_UUID.replace(`${cf.CMATERIAL_UUID}/`, ""),
        iStockText: "",
        categoryID: cf.CCATCP_UUID,
        categoryText: cf.TCATCP_UUID,
        quantity: Quantity.create(cf.KCINV_QUAN_NORMAL, cf.UCINV_QUAN_NORMAL),
        moveDirectionID: cf.CMOVE_DIRECTION,
        noTestNeed: cf.C1N6061KGKRRDY27JVXB8IBB48I,
        postingDate: convDate(dayjs, cf.CBT_POSTING_DATE),
        documentID,
        originTypeID: cf.CREF_MST_TYPE,
        refTypeID: cf.CREF_TYPE,
        qcName: cf.C1H4ROBQ2CJYN7HZXJJXDQ9N3TM,
        fullName: cf.C1PUM32FIIWRGVQAF4BD5HUK4HA,
      };
    });
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD") => {
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
  return dayjs(date).format(format);
};

module.exports.convDate = convDate;

const unitList = {
  CMT: { decimal: 3, text: "센티미터", external: { id: "cm" } },
  EA: { decimal: 0, text: "개별", external: { id: "ea" } },
  GRM: { decimal: 3, text: "그램", external: { id: "g" } },
  KGM: { decimal: 3, text: "킬로그램", external: { id: "kg" } },
  MTR: { decimal: 3, text: "미터", external: { id: "m" } },
  PR: { decimal: 0, text: "Pair", external: { id: "pair" } },
  XRO: { decimal: 3, text: "롤", external: { id: "roll" } },
};

const Quantity = {
  create: (qty, unit) => {
    const fUnit = Object.keys(unitList).find((_unit) => _unit === unit);
    const unitData = fUnit ? unitList[unit] : { text: "", external: {} };
    const maximumFractionDigits = isNaN(unitData.decimal)
      ? 3
      : unitData.decimal;
    return {
      number: Number(qty),
      formatted: Number(qty).toLocaleString("ko-KR", {
        maximumFractionDigits,
      }),
      unit: { ...unitData, id: unit },
    };
  },
  add: (al, ...arg) => {
    return arg.reduce((acc, curr) => {
      return acc + curr;
    }, Number(al));
  },
};

module.exports.Quantity = Quantity;
