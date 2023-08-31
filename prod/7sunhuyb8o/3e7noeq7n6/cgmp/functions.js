module.exports.fetchAll = async (odata, { url, username, password }) => {
  // url에 skip이 들어가 있으면 안됨, $top이 있어도 전체 data를 받아옴
  const getData = (skip = 0) =>
    odata.get({
      url: `${url}&$skip=${skip}`,
      username,
      password,
    });
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
    return { errorMsg: error.message, result: [] };
  }
};

module.exports.getQueryParams = ({ params, env = {} }) => {
  return {
    "sap-language": "ko",
    $top: "500",
    $format: "json",
    $inlinecount: "allpages",
    $filter: [
      "(PARA_CR_DATE gt datetime'1980-01-01T00:00:00')",
      // "(CCANC_STATUS eq '1')", // 취소되지 않은 문서만 포함
      params.includeCanceledItem ? "" : "(CCANC_STATUS eq '1')",
      (() => {
        if (!params.siteID) return "";
        if (Array.isArray(params.siteID)) {
          return `(${params.siteID
            .map((id) => `CSITE_UUID eq '${id}'`)
            .join(" or ")})`;
        } else {
          return `(CSITE_UUID eq '${params.siteID}')`;
        }
      })(), // 사이트 ID
      (() => {
        if (!params.materialID) return "";
        if (Array.isArray(params.materialID)) {
          return `(${params.materialID
            .map((id) => `CMATERIAL_UUID eq '${id}'`)
            .join(" or ")})`;
        } else {
          return `(CMATERIAL_UUID eq '${params.materialID}')`;
        }
      })(), // 제품 ID
      (() => {
        if (!params.productCategory) return "";
        if (Array.isArray(params.productCategory)) {
          return `(${params.productCategory
            .map((id) => `CCATCP_UUID eq '${id}'`)
            .join(" or ")})`;
        } else {
          return `(CCATCP_UUID eq '${params.productCategory}')`;
        }
      })(), // 제품범주
      (() => {
        if (!params.identifiedStockID) return "";
        if (Array.isArray(params.identifiedStockID)) {
          return `(${params.identifiedStockID
            .map((id) => `CISTOCK_UUID eq '${id}'`)
            .join(" or ")})`;
        } else {
          return `(CISTOCK_UUID eq '${params.identifiedStockID}')`;
        }
      })(), // 동종재고
      (() => {
        const postingDateStart = params.postingDateStart
          ? [
              "CBT_POSTING_DATE ge datetime",
              `'${params.postingDateStart}T00:00:00'`,
            ].join("")
          : ""; // 전기일 시작일
        const postingDateEnd = params.postingDateEnd
          ? [
              "CBT_POSTING_DATE le datetime",
              `'${params.postingDateEnd}T23:59:59'`,
            ].join("")
          : ""; // 전기일 종료일
        if (!postingDateStart && !postingDateEnd) {
          return "";
        } else if (postingDateStart && postingDateEnd) {
          return `(${postingDateStart} and ${postingDateEnd})`;
        } else {
          return `${postingDateStart || postingDateEnd}`;
        }
      })(),
      params.originalDocumentTypeCode
        ? `(CREF_MST_TYPE eq '${params.originalDocumentTypeCode}')`
        : "", // 원본문서유형코드
      params.refDocumentTypeCode
        ? `(CREF_TYPE eq '${params.refDocumentTypeCode}')`
        : "", // 참조문서유형코드
      params.CINVCH_REASON
        ? `(CINVCH_REASON eq '${params.CINVCH_REASON}')`
        : "", // CINVCH_REASON
    ]
      .filter(Boolean)
      .join(" and "),
    ...(() => {
      // custom select
      if (params.select) {
        return {
          $select: params.select,
        };
      }
      // default select
      return {
        $select: [
          "CSITE_UUID", // 사이트 ID
          "TSITE_UUID", // 사이트 텍스트
          "CMATERIAL_UUID", // 제품 ID
          env.CGMP_FULLNAME, // 풀네임
          env.CGMP_PROD_DATE, // 동종재고 생산일
          "CISTOCK_UUID", // 동종 재고 ID
          "TISTOCK_UUID", // 동종재고 텍스트
          "CREF_ID", // 참조 문서ID
          "TREF_TYPE", // 참조 문서 유형 텍스트
          "CREF_TYPE", // 참조 문서 유형 코드
          "CCONF_ID", // 확인 ID
          "CCONF_TYPE", // 확인 문서 유형
          "CREF_MST_TYPE", // 원본 문서 유형 코드
          "TREF_MST_TYPE", // 원본 문서 유형 텍스트
          "CREF_MST_ID", // 원본 문서 ID
          "CCANC_STATUS", // 취소여부
          "CLOG_AREA_UUID", // 물류영역
          "CINVCH_REASON", // 재고변경사유 코드
          "TINVCH_REASON", // 재고변경사유
          "CPROD_TASK_ID", // 프로젝트 태스크 ID
          "CMOVE_DIRECTION", // 재고 이동 방향 코드
          "TMOVE_DIRECTION", // 재고 이동 방향 텍스트
          "CBT_POSTING_DATE", // 전기일
          "KCCONFIRMED_QUANTITY", // 확인된 수량
          "CCONF_UNIT", // 확인된  수량 단위
          "KCINV_QUAN_NORMAL", // 유효수량
          "UCINV_QUAN_NORMAL", // 유효 수량 단위
          "CTA_DATE", // 실제 실행일
          "CITEM_ID", // 확정 품목 ID
          "C1ISTOCK_UUIDsSUPPLIER_ID", // 공급사ID
          "CLOG_CONF_TYPE", // 확정유형 ID
        ]
          .filter(Boolean)
          .join(","),
      };
    })(),
  };
};

module.exports.isEqual = (obj1, obj2) => {
  return Object.entries(obj1).toString() === Object.entries(obj2).toString();
};

module.exports.uniqWith = (arr) => {
  const isEqual = (obj1, obj2) => {
    return Object.entries(obj1).toString() === Object.entries(obj2).toString();
  };
  return arr.filter(
    (item, idx) => arr.findIndex((it) => isEqual(it, item)) === idx
  );
};

module.exports.convDate = (dayjs, dateStr, format = "YYYY-MM-DD") => {
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

module.exports.addWeekdays = (dayjs, date, days = 1, format = "YYYY-MM-DD") => {
  date = dayjs(date);
  while (days > 0) {
    date = date.add(1, "day");
    if (dayjs(date).day() !== 0 && dayjs(date).day() !== 6) {
      days -= 1;
    }
  }
  while (days < 0) {
    date = date.subtract(1, "day");
    if (dayjs(date).day() !== 0 && dayjs(date).day() !== 6) {
      days += 1;
    }
  }

  return date.format(format);
};

module.exports.getKey = ({ flowID, id, dateArr }) => {
  const [year, month, date] = dateArr;
  const resultUploadKey = ["byd/data", flowID, year, month, date, id].join("/");
  return resultUploadKey;
};

module.exports.unitCodeToKor = (unitCode) => {
  const uom = {
    ZSH: { text: "ZSH", dp: 3 },
    XRO: { text: "롤", dp: 3 },
    XPR: { text: "용기", dp: 0 },
    XBE: { text: "번들", dp: 0 },
    XBX: { text: "상자", dp: 0 },
    GRM: { text: "g", dp: 3 },
    HUR: { text: "h", dp: 3 },
    KGM: { text: "kg", dp: 3 },
    MIN: { text: "분", dp: 3 },
    MTQ: { text: "m³", dp: 3 },
    MTR: { text: "m", dp: 3 },
    SEC: { text: "s", dp: 3 },
    TNE: { text: "mt", dp: 3 },
    EA: { text: "개", dp: 0 },
    SET: { text: "세트", dp: 0 },
    XST: { text: "jo", dp: 0 },
    MLT: { text: "ml", dp: 0 },
    MTK: { text: "m²", dp: 3 },
    PR: { text: "pair", dp: 0 },
    YRD: { text: "yard", dp: 3 },
    ZBO: { text: "본", dp: 0 },
  };
  return uom[unitCode] ? uom[unitCode] : unitCode;
};
