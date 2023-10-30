module.exports = async (draft, { lib, request }) => {
  const { clone } = lib;

  draft.json.newData = clone(request.body.Data);
  draft.json.nextNodeKey = "Function#4";
  switch (request.body.InterfaceId) {
    case "IF-PMM-AUTH01":
      if (!request.body.Data.PASSWORD) {
        draft.response.body = {
          type: "F",
          message: "비밀번호가 \n입력되지 않았습니다",
        };
        draft.json.nextNodeKey = "Output#2";
      }
      break;
    case "IF-PMM-ORD01":
      draft.json.newData.IS_IMPORT.GUBUN = "1";
      break;
    case "IF-PMM-ORD02":
      draft.json.newData.IS_IMPORT.GUBUN = "3";
      break;
    case "IF-PMM-ORD03":
      draft.json.newData.IS_IMPORT.GUBUN = "5";
      break;
    case "IF-PMM-ORD04":
      draft.json.newData.IS_IMPORT.GUBUN = "2";
      break;
    case "IF-PMM-ORD05":
      draft.json.newData.IS_IMPORT.GUBUN = "6";
      draft.json.newData.IS_IMPORT.PERNR = "";
      break;
    case "IF-PMM-ORD09": {
      const { IT_TASKLIST, IS_IMPORT } = clone(request.body.Data);

      draft.json.newData = {
        IS_IMPORT: {
          ...IS_IMPORT,
          START_DATE: (IS_IMPORT.START_DATE || "").replace(/-/g, ""),
          FINISH_DATE: (IS_IMPORT.FINISH_DATE || "").replace(/-/g, ""),
        },
        IT_TASKLIST: IT_TASKLIST.map((task) => ({
          // 오더 생성 params 변경(23.07.11)
          PLNNR: task.PLNNR,
          PLNAL: task.PLNAL,
          VORNR: task.VORNR,
          LTXA1: task.LTXA1,
          ANZZL: task.ANZZL,
          ARBEI: task.ARBEI,
          ARBEH: task.ARBEH,
        })),
      };
      break;
    }
    case "IF-PMM-ORD08":
    case "IF-PMM-ORD10": {
      draft.json.newData = clone(request.body.Data);
      const { IS_IMPORT, activity } = clone(request.body.Data);
      const plan = activity.tables.find((table) => table.id === "planList") || {
        items: [],
      };
      const measure = activity.tables.find(
        (table) => table.id === "measureList"
      ) || {
        items: [],
      };
      const comp = activity.tables.find(
        (table) => table.id === "component"
      ) || {
        items: [],
      };
      const additionalPlan = activity.tables.find(
        (table) => table.id === "additionalPlan"
      ) || { items: [] };
      const addComp = activity.tables.find(
        (table) => table.id === "addComp"
      ) || {
        items: [],
      };

      const MALFUNCTION = {
        IT_MALFUNCTION_5: [],
        IT_MALFUNCTION_A: [],
        IT_MALFUNCTION_B: [],
        IT_MALFUNCTION_C: [],
      };
      activity.katalogList.forEach((item) => {
        const prefix = "ET_DATA";
        ["5", "A", "B", "C"].forEach((type) => {
          const fKey = "CODE";
          const fValue = item[[prefix, type, fKey].join("_")];
          const fKat = activity[[prefix, type].join("_")].find(
            (kat) => kat[fKey] === fValue
          );
          if (fKat) {
            const { key, text, ...args } = fKat;
            console.log(key, text);
            MALFUNCTION[["IT_MALFUNCTION", type].join("_")].push({ ...args });
          }
        });
      });

      draft.json.newData = {
        ...MALFUNCTION,
        IS_IMPORT: {
          ...IS_IMPORT,
          AUSBS: (IS_IMPORT.AUSBS || "").replace(/-|:/g, ""),
          AUSVN: (IS_IMPORT.AUSVN || "").replace(/-|:/g, ""),
          AUZTB: (IS_IMPORT.AUZTB || "").replace(/-|:/g, ""),
          AUZTV: (IS_IMPORT.AUZTV || "").replace(/-|:/g, ""),
        },
        IT_COMPONENT: comp.items.map((item) => {
          const { key, text } =
            (activity.siteLogistics && activity.siteLogistics[0]) || {};
          return {
            VORNR: item.VORNR,
            LTXA1: item.LTXA1,
            MATNR: item.MATNR,
            MAKTX: item.MAKTX,
            BDMNG: item.QTY_INPUT,
            MEINS: item.MEINS,
            LGORT: item.LGORT || key,
            LGOBE: item.LGOBE || text,
            CHARG: item.CHARG,
          };
        }),
        IT_MEASURING_P: measure.items.map((item) => ({
          VORNR: item.VORNR,
          LTXA1: item.LTXA1,
          POINT: item.POINT,
          PTTXT: item.PTTXT,
          DESIC: item.DESIC_INPUT,
          ZZSTDIN: item.ZZSTDIN,
          UNIT: item.UNIT,
          GRUND: item.GRUND,
        })),
        IT_OPERATION: plan.items.map((item) => {
          const fAC = addComp.items.find(
            (it) => it.VORNR === item.VORNR && it.LTXA1 === item.LTXA1
          );
          const LTXA1_C = fAC && fAC.LTXA1_C;
          const fCheckList = activity.checkCodeList.find(
            (cc) => cc.GRUND === item.GRUND
          );
          return {
            VORNR: item.VORNR,
            LTXA1: item.LTXA1,
            ANZZL: item.ANZZL_INPUT,
            ARBPL: IS_IMPORT.PERNR,
            KTEXT_W: item.KTEXT_W,
            ARBEI: item.ARBEI_INPUT,
            ARBEH: item.ARBEH,
            GRUND: item.GRUND,
            GRDTX: (fCheckList && fCheckList.GRDTX) || "",
            LTXA1_C,
          };
        }),
        IT_ADDJOB: [{ TDLINE: additionalPlan.items[0].TEXT }],
        IT_ADDFILE: activity.attachments.map((attach) => ({ URL: attach })),
      };

      draft.response.body.newData = { ...draft.json.newData };
      break;
    }
    case "IF-PMM-ORD11":
      draft.json.newData.IV_GUBUN = "2";
      break;
    case "IF-PMM-NOTI01": {
      const { IS_IMPORT, IT_MALFUNCTION, IT_NOTI_TEXT } = clone(
        request.body.Data
      );
      const { IT_TEXT_Q1, IT_TEXT_Q2, IT_TEXT_Q3, ...args } = IS_IMPORT;
      // 통지 제목 관련 수정 23.01.19
      const QMTXT = [
        IS_IMPORT.QMTXT,
        IS_IMPORT.EQUNR,
        IS_IMPORT.TPLNR,
        request.body.Function.UserText,
      ]
        .filter(Boolean)
        .join("_");
      const MALFUNCTION = {
        IT_MALFUNCTION_5: [],
        IT_MALFUNCTION_A: [],
        IT_MALFUNCTION_B: [],
        IT_MALFUNCTION_C: [],
      };
      if (IT_MALFUNCTION && IT_MALFUNCTION.length > 0) {
        IT_MALFUNCTION.forEach((item) => {
          const key = item.KATALOGART;
          MALFUNCTION[`IT_MALFUNCTION_${key}`].push(item);
        });
      }
      draft.json.newData = {
        ...MALFUNCTION,
        IS_IMPORT: {
          ...args,
          QMTXT,
          STRMN: (IS_IMPORT.STRMN || "").replace(/-|:/g, ""),
          LTRMN: (IS_IMPORT.LTRMN || "").replace(/-|:/g, ""),
          AUSVN: (IS_IMPORT.AUSVN || "").replace(/-|:/g, ""),
          AUZTV: (IS_IMPORT.AUZTV || "").replace(/-|:/g, ""),
        },
        IT_NOTI_TEXT,
        IT_TEXT_Q1,
        IT_TEXT_Q2,
        IT_TEXT_Q3,
      };
      break;
    }
    case "IF-PMM-NOTI05":
      draft.json.newData.IV_GUBUN = "1";
      break;
    case "IF-PMM-PLT01":
      break;
    case "IF-PMM-WC01":
      break;
    case "IF-PMM-EQ01":
      draft.json.newData.IS_IMPORT.GUBUN = "4";
      draft.json.newData.IS_IMPORT.GUBUN_FE = "E";
      draft.json.WERKS = draft.json.newData.IS_IMPORT.WERKS;
      break;
    case "IF-PMM-EQ02":
      draft.json.newData.IS_IMPORT.GUBUN = "1";
      draft.json.newData.IS_IMPORT.GUBUN_FE = "E";
      break;
    case "IF-PMM-EQ03":
      draft.json.newData.IS_IMPORT.GUBUN = "3";
      draft.json.newData.IS_IMPORT.GUBUN_FE = "E";
      break;
    case "IF-PMM-EQ05":
      break;
    case "IF-PMM-FL01":
      draft.json.newData.IS_IMPORT.GUBUN_FE = "F";
      break;
    case "IF-PMM-MAT01":
      break;
    case "IF-PMM-CAT01":
      if (draft.json.newData.IS_IMPORT.TPLNR) {
        draft.json.nextNodeKey = "Function#7";
      }
      break;
    default:
      //
      break;
  }
};
