module.exports = async (draft, { request }) => {
  const EQUIIPMENT_FIELD_LIST = draft.json.EQUIIPMENT_FIELD_LIST;
  const EQ_ConversionFn = (list = [], opt = { WERKS: "" }) => {
    return list.map((item) => {
      const EQTYP = item.EQTYP;
      let fEQUIIPMENT_FIELD_LIST;
      if (EQTYP) {
        fEQUIIPMENT_FIELD_LIST = EQUIIPMENT_FIELD_LIST.filter(
          (field) => !field.EQTYP || field.EQTYP.includes(EQTYP)
        );
      } else fEQUIIPMENT_FIELD_LIST = EQUIIPMENT_FIELD_LIST;
      const data = fEQUIIPMENT_FIELD_LIST.map(({ id, text }) => {
        const value = EQ_ValueFn(id, item[id]);
        return rmSpace({ id, text, value });
      });
      if (opt.WERKS) {
        data.push({ id: "WERKS", text: "플랜트", value: opt.WERKS });
      }
      return data;
    });
  };
  switch (request.body.InterfaceId) {
    case "IF-PMM-AUTH01":
      break;
    case "IF-PMM-ORD01":
    case "IF-PMM-ORD02":
    case "IF-PMM-ORD03":
      draft.response.body = {
        ...draft.response.body,
        orders: draft.response.body.ET_MAIN,
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-ORD04":
      if (draft.response.body.ES_HEADER.AUART) {
        const {
          ES_HEADER,
          ES_RETURN,
          ET_OPERATION,
          ET_COMPONENT,
          ET_MEASURING_P,
        } = { ...draft.response.body };

        const defaultObj = {
          ...ES_HEADER,
          GSTRP:
            ES_HEADER.GSTRP &&
            [
              ES_HEADER.GSTRP.slice(0, 4),
              ES_HEADER.GSTRP.slice(4, 6),
              ES_HEADER.GSTRP.slice(6, 8),
            ].join("."),
          GLTRP:
            ES_HEADER.GLTRP &&
            [
              ES_HEADER.GLTRP.slice(0, 4),
              ES_HEADER.GLTRP.slice(4, 6),
              ES_HEADER.GLTRP.slice(6, 8),
            ].join("."),
          operation: ET_OPERATION.map((item) => rmSpace(item)),
          component: ET_COMPONENT.map((item) => rmSpace(item)),
        };
        switch (ES_HEADER.AUART) {
          default:
            draft.response.body = {
              ...draft.response.body,
              order: {
                ...defaultObj,
                measuring: ET_MEASURING_P.map(rmSpace),
                tables: [
                  {
                    id: "planList",
                    title: "작업정보",
                    columns: [
                      {
                        id: "LTXA1",
                        text: "작업 내역",
                        properties: { hAlign: "Left" },
                      },
                      { id: "ARBEI_INPUT", text: "인원 결과", type: "input" },
                      {
                        id: "ANZZL_INPUT",
                        text: "작업시간 결과",
                        type: "input",
                      },
                      { id: "ARBEH", text: "단위" },
                      {
                        id: "GRUND",
                        text: "결과",
                        type: "Select",
                        list: "checkCodeList",
                        options: { enabled: "{= ${canModify}}" },
                      },
                    ],
                    items: ET_OPERATION.map((item, idx) =>
                      rmSpace(
                        {
                          ...item,
                          canModify: !ET_MEASURING_P.find(
                            (ms) => ms.VORNR === item.VORNR
                          ),
                        },
                        idx
                      )
                    ),
                  },
                  {
                    id: "measureList",
                    title: "측정정보",
                    columns: [
                      { id: "POINT", text: "측정위치" },
                      { id: "PTTXT", text: "측정위치 내역" },
                      { id: "MRMAC", text: "상한" },
                      { id: "MRMIC", text: "하한" },
                      { id: "UNIT", text: "단위" },
                      { id: "DESIC_INPUT", text: "측정값", type: "input" },
                      {
                        id: "GRUND",
                        text: "결과",
                        type: "Select",
                        list: "measureCodeList",
                        options: { enabled: false },
                      },
                    ],
                    items: ET_MEASURING_P.map(rmSpace).map((item) => ({
                      ...item,
                      isGrundItem: true,
                    })),
                  },
                  {
                    id: "component",
                    title: "자재출고정보",
                    columns: [
                      {
                        id: "LTXA1",
                        text: "작업 내역",
                        properties: { hAlign: "Left" },
                      },
                      { id: "MAKTX", text: "자재명" },
                      { id: "MATNR", text: "자재코드" },
                      { id: "BDMNG", text: "예약수량" },
                      { id: "MEINS", text: "단위" },
                      {
                        id: "LGOBE",
                        text: "저장위치",
                        type: "Select",
                        list: "siteLogistics",
                      },
                      {
                        id: "QTY_INPUT",
                        text: "출고 수량",
                        type: "input",
                      },
                    ],
                    items: ET_COMPONENT.map((item) =>
                      rmSpace({ ...item, QTY_INPUT: item.BDMNG })
                    ),
                    // .map(item => ({
                    //   ...item,
                    //   LGORT:
                    //     draft.siteLogistics[0] && draft.siteLogistics[0].key,
                    //   LGOBE:
                    //     draft.siteLogistics[0] && draft.siteLogistics[0].text
                    // }))
                  },
                  {
                    id: "additionalPlan",
                    title: "추가작업정보",
                    columns: [
                      {
                        id: "TEXT",
                        text: "내용",
                        type: "TextArea",
                        properties: {},
                      },
                    ],
                    items: [{ TEXT: "" }],
                  },
                  {
                    id: "addComp",
                    title: "추가자재출고정보",
                    columns: [
                      {
                        id: "LTXA1",
                        text: "작업 내역",
                        properties: { hAlign: "Left" },
                      },
                      {
                        id: "LTXA1_C",
                        text: "추가자재출고정보",
                        type: "input",
                        options: {
                          type: "text",
                          textAlign: "Initial",
                          width: "90%",
                          maxLength: 40,
                          valueState: "Information",
                          valueStateText: "최대 40자까지 입력가능합니다.",
                        },
                      },
                    ],
                    items: ET_OPERATION.map((item) =>
                      rmSpace({ ...item, LTXA1_C: "" })
                    ),
                  },
                  ES_HEADER.EQUNR && ES_HEADER.QMNUM
                    ? {
                        id: "katalogList",
                        title: "고장데이터",
                        mode: "MultiSelect",
                        toolbars: [
                          {
                            id: "add",
                            text: "추가",
                            properties: { icon: "sap-icon://add" },
                          },
                          {
                            id: "delete",
                            text: "삭제",
                            properties: { icon: "sap-icon://less" },
                          },
                        ],
                        columns: [
                          {
                            id: "ET_DATA_B_CODE",
                            text: "고장부위",
                            type: "Select",
                            list: "ET_DATA_B",
                          },
                          {
                            id: "ET_DATA_B_CODEGRUPPE",
                            text: "고장부위정보",
                            type: "Identifier",
                            list: "ET_DATA_B_CODE",
                            options: { text: "{ET_DATA_B_CODE}" },
                          },
                          {
                            id: "ET_DATA_5_CODE",
                            text: "고장원인",
                            type: "Select",
                            list: "ET_DATA_5",
                          },
                          {
                            id: "ET_DATA_5_CODEGRUPPE",
                            text: "고장원인정보",
                            type: "Identifier",
                            list: "ET_DATA_5_CODE",
                            options: { text: "{ET_DATA_5_CODE}" },
                          },
                          {
                            id: "ET_DATA_C_CODE",
                            text: "고장현상",
                            type: "Select",
                            list: "ET_DATA_C",
                          },
                          {
                            id: "ET_DATA_C_CODEGRUPPE",
                            text: "고장현상정보",
                            type: "Identifier",
                            list: "ET_DATA_C_CODE",
                            options: { text: "{ET_DATA_C_CODE}" },
                          },
                          {
                            id: "ET_DATA_A_CODE",
                            text: "조치사항",
                            type: "Select",
                            list: "ET_DATA_A",
                          },
                          {
                            id: "ET_DATA_A_CODEGRUPPE",
                            text: "조치사항정보",
                            type: "Identifier",
                            list: "ET_DATA_A_CODE",
                            options: { text: "{ET_DATA_A_CODE}" },
                          },
                        ],
                        listName: "katalogList",
                      }
                    : undefined,
                ].filter(Boolean),
              },
              type: ES_RETURN.STATUS || "S",
              message: ES_RETURN.MESSAGE || "완료되었습니다",
            };
            break;
        }
      }
      break;
    case "IF-PMM-ORD05":
      draft.response.body = {
        ...draft.response.body,
        order:
          draft.response.body.ET_MAIN.length === 1
            ? { ...draft.response.body.ET_MAIN[0] }
            : undefined,
        orders: draft.response.body.ET_MAIN.map((item) => ({ ...item })),
        type: draft.response.body.ES_RETURN.STATUS || "S",
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-ORD07": {
      const { QMNUM, AUSVN, AUZTV, AUSBS, AUZTB, MSAUS } =
        draft.response.body.ES_IMPORT;
      const { IT_OPERATION, IT_MEASURING_P } = draft.response.body;
      const { IT_COMPONENT, IT_ADDJOB, IT_ADDFILE } = draft.response.body;

      const katalogStack = ["5", "A", "B", "C"].reduce((stack, type) => {
        const katalog = draft.response.body[["IT_MALFUNCTION", type].join("_")];
        katalog.forEach((kat, idx) => {
          if (stack[idx]) {
            ["CODE", "CODEGRUPPE"].forEach((key) => {
              stack[idx][["ET_DATA", type, key].join("_")] = kat[key];
            }); // "KURZTEXT_T"
          } else {
            const obj = {};
            ["CODE", "CODEGRUPPE"].forEach((key) => {
              obj[["ET_DATA", type, key].join("_")] = kat[key];
            });
            stack.push(obj);
          }
        });
        return stack;
      }, []);

      const list = [IT_OPERATION, IT_MEASURING_P].concat(
        [IT_COMPONENT, IT_ADDJOB, IT_ADDFILE],
        katalogStack
      );
      let E_STATUS = "F";
      let E_MESSAGE = "저장된 내역이 없습니다";
      if (QMNUM || AUSVN || AUZTV || AUSBS || AUZTB || !!MSAUS) {
        E_STATUS = "S";
        E_MESSAGE = "임시저장 된 내역이 있습니다.\n불러오시겠습니까?";
      }
      if (list.find((table) => table.length > 0)) {
        E_STATUS = "S";
        E_MESSAGE = "임시저장 된 내역이 있습니다.\n불러오시겠습니까?";
      }

      const form = { QMNUM, AUSVN, AUZTV, AUSBS, AUZTB, MSAUS: !!MSAUS };

      const pItems = IT_OPERATION.map(({ LTXA1, ARBEI, ANZZL, GRUND }) => {
        return { LTXA1, ARBEI_INPUT: ARBEI, ANZZL_INPUT: ANZZL, GRUND };
      });
      const mItems = IT_MEASURING_P.map(({ DESIC, GRUND }) => {
        return { DESIC_INPUT: DESIC, GRUND };
      });
      const cItems = IT_COMPONENT.map(({ LTXA1, LGORT, LGOBE, BDMNG }) => {
        return { LTXA1, LGORT, LGOBE, QTY_INPUT: BDMNG };
      });
      const apItems = IT_ADDJOB.map(({ TDLINE }) => ({ TEXT: TDLINE }));
      const acItmes = IT_OPERATION.map(({ VORNR, LTXA1, LTXA1_C }) => {
        return { VORNR, LTXA1, LTXA1_C };
      });
      draft.response.body = {
        ...draft.response.body,
        E_STATUS,
        E_MESSAGE,
        katalogStack,
        activity: {
          form,
          tables: [
            { id: "planList", items: pItems },
            { id: "measureList", items: mItems },
            { id: "component", items: cItems },
            { id: "additionalPlan", items: apItems },
            { id: "addComp", items: acItmes },
          ],
          katalogList: [],
          attachments: IT_ADDFILE.map(({ URL }) => URL),
        },
      };
      break;
    }
    case "IF-PMM-ORD09":
      draft.response.body = {
        ...draft.response.body,
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-ORD10":
      draft.response.body = {
        ...draft.response.body,
        type: draft.response.body.ES_RETURN.STATUS,
        message: draft.response.body.ES_RETURN.MESSAGE,
      };
      break;
    case "IF-PMM-ORD11":
      draft.response.body = {
        ...draft.response.body,
        orderType: draft.response.body.ET_ORD_TYPE.map((item) => ({
          key: item.AUART,
          text: item.TXT,
        })),
      };
      break;
    case "IF-PMM-CAT01": {
      const ES_RETURN = draft.response.body.ES_RETURN || {};
      const ET_DATA_LIST = ["ET_DATA_5", "ET_DATA_A", "ET_DATA_B", "ET_DATA_C"];

      ET_DATA_LIST.forEach((list) => {
        const fList = draft.response.body[list];
        if (fList && fList.length > 0) {
          draft.response.body[list] = [{ key: "", text: "" }].concat(
            fList.map((item) => ({
              ...item,
              key: item.CODE,
              text: item.KURZTEXT_T,
            }))
          );
        }
      });

      draft.response.body = {
        ...draft.response.body,
        deficiencyRisk: [
          {
            index: 1,
            question: [
              "CPP/CQA에 영향이 있는 결함인가?",
              " ",
              "(Did the defect affect CPP/CQA?)",
            ].join("\n"),
            answer: "Yes",
            description: "",
            editable: false,
          },
          {
            index: 2,
            question: [
              "공정 중 발생된 결함인가?",
              " ",
              "(Was it a defect that occurred during a Process?)",
            ].join("\n"),
            answer: "Yes",
            description: "",
            editable: false,
          },
          {
            index: 3,
            question: [
              "시설의 경우 청정도 관리지역 내에서 발생한 결함인가?",
              " ",
              "(In the case of facilities, was the defect occurring",
              "within the cleanliness management area?)",
            ].join("\n"),
            answer: "Yes",
            description: "",
            editable: false,
          },
        ],
        type: ES_RETURN.STATUS,
        message: ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    }
    case "IF-PMM-CC01":
      draft.response.body = {
        ...draft.response.body,
        list: [{ key: "", text: "" }].concat(
          (draft.response.body.ET_DATA || []).map((item) => ({
            ...item,
            key: item.GRUND,
            text: item.GRDTX,
          }))
        ),
        list_C: [{ key: "", text: "" }].concat(
          (draft.response.body.ET_DATA1 || []).map((item) => ({
            ...item,
            key: item.GRUND,
            text: item.GRDTX,
          }))
        ),
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-NOTI01":
      draft.response.body = {
        ...draft.response.body,
        type: draft.response.body.ES_RETURN.STATUS,
        message: draft.response.body.ES_RETURN.MESSAGE,
      };
      break;
    case "IF-PMM-NOTI05":
      draft.response.body = {
        ...draft.response.body,
        notifyType: draft.response.body.ET_NOTI_TYPE.map((item) => ({
          key: item.QMART,
          text: item.QMARTX,
        })),
      };
      break;
    case "IF-PMM-PLT01":
      break;
    case "IF-PMM-WC01":
      draft.response.body = {
        // ET_DATA: draft.response.body.ET_DATA.map((it) => ({ ...it })),
        plants: draft.response.body.ET_DATA.filter(
          (item, idx) =>
            draft.response.body.ET_DATA.findIndex(
              (it) => it.WERKS === item.WERKS
            ) === idx
        ).map((item) => item.WERKS),
        workCenter: draft.response.body.ET_DATA.map((item) => ({
          key: item.ARBPL,
          text: item.KTEXT,
        })),
      };
      break;
    case "IF-PMM-EQ01": {
      if (draft.response.body.ET_DATA.length === 1) {
        draft.response.body.EQUNR = draft.response.body.ET_DATA[0].EQUNR;
      }
      const WERKS = draft.json.WERKS;
      draft.response.body = {
        ...draft.response.body,
        equipments: EQ_ConversionFn(draft.response.body.ET_DATA, { WERKS }),
        message:
          draft.response.body.ET_DATA.length !== 0
            ? "조회가 완료되었습니다."
            : "조건에 맞는 값이 없습니다.",
      };
      break;
    }
    case "IF-PMM-EQ02": {
      if (draft.response.body.ES_DATA.EQUNR) {
        draft.response.body.EQUNR = draft.response.body.ES_DATA.EQUNR;
        const item = draft.response.body.ES_DATA;
        draft.response.body = {
          ...draft.response.body,
          EQUNR: draft.response.body.ES_DATA.EQUNR,
          equipment: EQ_ConversionFn([item])[0],
          message: "조회가 완료되었습니다.",
          type: "S",
        };
      } else {
        draft.response.body = {
          ...draft.response.body,
          message: "조건에 맞는 값이 없습니다.",
        };
      }
      break;
    }
    case "IF-PMM-EQ03":
      draft.response.body = {
        hierarchy: draft.response.body.ET_HIERARCHY.map((item) => {
          const type = {
            A: "Assembly",
            C: "Component",
            I: "Instruments",
            F: "Hepa Filter",
            M: "Materials",
            S: "System Hierarchy",
          };
          return {
            ...item,
            EQTYP_TEXT: (item.EQTYP && type[item.EQTYP]) || "None",
          };
        }).sort((al, be) => {
          if (al.EQTYP === "M") return 1;
          if (be.EQTYP === "M") return -1;
        }),
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-EQ05":
      draft.response.body = {
        ...draft.response.body,
        taskList: draft.response.body.ET_ITEM.map((item, idx) => {
          const { ET_HEADER, ET_MEASURING_P } = draft.response.body;
          /**
           * 직무리스트 조합 수정 (*23.07.13)
           * Measuring 처리 시
           * ET_MEASURING_P VORNR 앞에 0제거한 값이
           * ET_ITEM VORNR 값과 같은 것을 찾도록 수정 (Header는 그대로 유지)
           */
          const findFn1 = (it1, it2) =>
            it1.PLNNR === it2.PLNNR && it1.PLNAL === it2.PLNAL;
          const findFn2 = (it1, it2) =>
            it1.PLNNR === it2.PLNNR &&
            it1.PLNAL === it2.PLNAL &&
            it1.VORNR === (it2.VORNR || "").padStart(4, "0");
          const fET_HEADER = findObj(ET_HEADER, item, findFn1);
          const fET_MEASURING = findObj(ET_MEASURING_P, item, findFn2);
          return { IDX: idx + 1, ...fET_HEADER, ...fET_MEASURING, ...item };
        }),
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-FL01":
      break;
    case "IF-PMM-SL01":
      draft.response.body = {
        ...draft.response.body,
        siteLogistics: draft.response.body.ET_DATA.map((item) => ({
          key: item.LGORT,
          text: item.LGOBE,
        })),
        type: draft.response.body.ES_RETURN.STATUS,
        message:
          draft.response.body.ES_RETURN.MESSAGE || "조회가 완료되었습니다",
      };
      break;
    case "IF-PMM-MAT01":
      break;
    default:
      //
      break;
  }
};

const findObj = (array = [], sourceObj = {}, fn) => {
  return array.find((obj) => fn(obj, sourceObj)) || {};
};

const rmSpace = (obj = {}, idx) => {
  const newObj = { INDEX: idx + 1 };
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      newObj[key] = obj[key].replace(/^\s* |\s*$/i, "");
    } else newObj[key] = obj[key];
  });
  return newObj;
};

const EQ_ValueFn = (rfcKey, rfcValue) => {
  switch (rfcKey) {
    case "ZSPEC13": {
      switch (rfcValue) {
        case "1":
          return "DI";
        case "2":
          return "IDI";
        case "3":
          return "NI";
        case "4":
          return "Non-GMP";
        default:
          return rfcValue;
      }
    }
    case "ZSPEC39": {
      switch (rfcValue) {
        case "1":
          return "Class I";
        case "2":
          return "Class II";
        case "3":
          return "Class III";
        case "4":
          return "Class IV";
        case "5":
          return "N/A";
        default:
          return rfcValue;
      }
    }
    case "ZSPEC40": {
      switch (rfcValue) {
        case "1":
          return "Low";
        case "2":
          return "Medium";
        case "3":
          return "High";
        case "4":
          return "N/A";
        default:
          return rfcValue;
      }
    }
    case "ZSPEC41": {
      switch (rfcValue) {
        case "1":
          return "None CS";
        case "2":
          return "GAMP 1";
        case "3":
          return "GAMP 3";
        case "4":
          return "GAMP 4";
        case "5":
          return "GAMP 5";
        default:
          return rfcValue;
      }
    }
    case "ZSPEC42": {
      switch (rfcValue) {
        case "1":
          return "Level 1";
        case "2":
          return "Level 2";
        case "3":
          return "Level 3";
        case "4":
          return "N/A";
        default:
          return rfcValue;
      }
    }
    case "ZSPEC43": {
      switch (rfcValue) {
        case "1":
          return "Electronic Record";
        case "2":
          return "Electronic Signature";
        case "3":
          return "N/A";
        default:
          return rfcValue;
      }
    }
    default:
      return rfcValue;
  }
};
