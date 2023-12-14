module.exports = async (draft, { request, tryit }) => {
  const result = draft.json.rfcCallResult;
  const ET_DATA = tryit(() => result.body.result.ET_DATA, []) || [];
  switch (request.body.InterfaceId) {
    case "IF-FI-011": {
      const searchCode = tryit(() => result.body.result.I_ZCODE, "");
      switch (searchCode) {
        case "FI01": {
          draft.response.body = {
            ...result.body.result,
            list: ET_DATA.map(({ ZZCDEZ, ZCNTS1 }) => ({
              key: ZZCDEZ,
              text: ZCNTS1,
              cost_type_id: ZZCDEZ,
              cost_type: ZCNTS1,
            })).sort((al, be) => al.key - be.key),
          };
          break;
        }
        case "FI02":
        case "FI03": {
          const yearPrefix = {
            9: "18", // 1800 ~ 1899년에 태어난 남성
            0: "18", // 1800 ~ 1899년에 태어난 여성
            1: "19", // 1900 ~ 1999년에 태어난 남성
            2: "19", // 1900 ~ 1999년에 태어난 여성
            3: "20", // 2000 ~ 2099년에 태어난 남성
            4: "20", // 2000 ~ 2099년에 태어난 여성
            5: "19", // 1900 ~ 1999년에 태어난 외국인 남성
            6: "19", // 1900 ~ 1999년에 태어난 외국인 여성
            7: "20", // 2000 ~ 2099년에 태어난 외국인 남성
            8: "20", // 2000 ~ 2099년에 태어난 외국인 여성
          };
          const getBirthDate = (id_no) =>
            [yearPrefix[id_no[6]], id_no.substring(0, 6)]
              .filter(Boolean)
              .join("");
          draft.response.body = {
            ...result.body.result,
            list: ET_DATA.map(({ ZZCDEZ, ZCNTS1, ZCNTS2, ...args }) => ({
              key: ZZCDEZ,
              text: ZCNTS1,
              ref_id: ZZCDEZ,
              name: ZCNTS1,
              gl_group_id: ZCNTS2,
              gl_group_text: args.ZCNTS3,
              prdnt_name: args.ZCNTS9,
              // gl_group_id가 "3000"인 경우 id_no: ZCNTS5 (그 외:ZCNTS6)
              id_no:
                (ZCNTS2 === "3000" && getBirthDate(args.ZCNTS5)) || args.ZCNTS6,
              biz_no:
                (ZCNTS2 === "3000" && getBirthDate(args.ZCNTS5)) || args.ZCNTS6,
              land_id: args.ZCNTS4,
              address: [args.ZCNTS13, args.ZCNTS14].filter(Boolean).join(" "),
              tel: "",
              isCompany: false,
              currency: null,
              payment_terms: args.ZCNTS11,
            })).sort(
              (al, be) =>
                Number(al.key.replace(/\.|,|-/g, "")) -
                Number(be.key.replace(/\.|,|-/g, ""))
            ),
          };
          break;
        }
        case "FI12": {
          const company = { ...ET_DATA[0] };
          draft.response.body = {
            ...result.body.result,
            list: ET_DATA.map((item) => ({
              index: 1,
              stems10: "1",
              key: item.ZZCDEZ,
              text: item.ZCNTS1,
              name: item.ZCNTS1,
              ref_id: item.ZZCDEZ,
              prdnt_name: item.ZCNTS5,
              id_no: item.ZCNTS3,
              biz_no: "",
              land_id: "",
              address: item.ZCNTS4,
              tel: "",
              isCompany: true,
              curr: item.ZCNTS2,
              payment_terms: null,
            })),
            value: {
              index: 1,
              stems10: "1",
              key: company.ZZCDEZ,
              text: company.ZCNTS1,
              name: company.ZCNTS1,
              ref_id: company.ZZCDEZ,
              prdnt_name: company.ZCNTS5,
              id_no: company.ZCNTS3,
              biz_no: "",
              land_id: "",
              address: company.ZCNTS4,
              tel: "",
            },
          };
          break;
        }
        default: {
          draft.response.body = {
            ...result.body.result,
            list: ET_DATA.map(({ ZZCDEZ, ZCNTS1 }) => ({
              key: ZZCDEZ,
              text: ZCNTS1,
            })),
          };
          break;
        }
      }

      break;
    }
    case "IF-CO-003": {
      draft.response.body = {
        ...result.body.result,
        list: ET_DATA.map(({ KOSTL, KTEXT }) => ({
          key: KOSTL,
          text: KTEXT,
          cost_object_id: KOSTL,
          name: KTEXT,
        })).sort(
          (al, be) =>
            Number(al.key.replace(/\.|,|-/g, "")) -
            Number(be.key.replace(/\.|,|-/g, ""))
        ),
      };
      break;
    }
    case "IF-CO-007": {
      draft.response.body = {
        ...result.body.result,
        list: ET_DATA.map(({ POSID, POST1 }) => ({
          key: POSID,
          text: POST1,
          cost_object_id: POSID,
          name: POST1,
        })).sort(
          (al, be) =>
            Number(al.key.replace(/\.|,|-/g, "")) -
            Number(be.key.replace(/\.|,|-/g, ""))
        ),
      };
      break;
    }
    case "IF-MM-001": {
      const ET_TAB = tryit(() => result.body.result.ET_TAB, []) || [];
      draft.response.body = {
        ...result.body.result,
        list: ET_TAB.map(({ MAKTX, MATNR }) => ({
          key: MATNR,
          text: MAKTX,
          matnr: MATNR,
          maktx: MAKTX,
        })).sort(
          (al, be) =>
            Number(al.key.replace(/\.|,|-/g, "")) -
            Number(be.key.replace(/\.|,|-/g, ""))
        ),
      };
      break;
    }
    default: {
      // draft.response.body = result.body.result;
      break;
    }
  }
};
