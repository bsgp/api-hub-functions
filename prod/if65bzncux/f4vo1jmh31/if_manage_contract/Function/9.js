module.exports = async (draft, { sql, env, tryit, fn, dayjs }) => {
  const { interfaceID, tables, newData } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-108": {
      /**
       * type === "DIFF"
       * * return difference curr-1's seq vs curr's seq jsonData
       *
       * type === "APPROVAL" =>  INDATE at curr seq
       * * json: curr all (GET ALL DB TABLE)
       * * return groupware conv jsonData
       *
       * type === "NEW" => INDATE at seq 0
       * * json: curr all (GET ALL DB TABLE)
       * * before: "",
       * * after: curr contDocValues
       * * return unipost jsonData
       *
       * type === "CHANGE" => INDATE at curr seq
       * * json: curr all (GET ALL DB TABLE)
       * * before: curr seq - 1's changeCont,
       * * after: curr contDocValues
       * * return unipost conv jsonData
       */
      const { currentUser, type, templateNo, form, ...args } = newData;
      const billFromParty = args.partyList.find(
        (party) => party.stems10 === "1"
      );
      const billToParty = args.partyList.find((party) => party.stems10 === "2");
      if (!billFromParty || !billToParty) {
        const E_MESSAGE = "계약당사자 정보가\n없습니다";
        draft.response.body = { E_MESSAGE, E_STATUS: "F", newData };
        return;
      }

      switch (type) {
        case "DIFF": {
          const lastSeq = (Number(form.seq) - 1).toString();
          const getLatestData = await sql("mysql", sqlParams)
            .select(tables.changed_contract.name)
            .where("contract_id", "like", `${form.id}`)
            .where("seq", "like", lastSeq)
            .run();
          const latestData = tryit(() => getLatestData.body.list[0], {});
          const latestJsonData = latestData && latestData.json;
          if (!latestJsonData) {
            draft.response.body = {
              E_MESSAGE: "이전 차수 계약정보가\n없습니다",
              E_STATUS: "F",
              newData,
              latestData,
            };
            return;
          }
          /** GET Diff latestJsonData vs jsonData */
          const source =
            get_Unipost_JSON(latestJsonData).contInfo.contDocValues;
          const target = get_Unipost_JSON(newData).contInfo.contDocValues;

          const diffItem = Object.keys(target).reduce((acc, curr) => {
            if (target[curr] !== source[curr]) {
              acc[curr] = { before: source[curr], after: target[curr] };
            }
            return acc;
          }, {});

          const chgContContents = [];
          const { contSdate, contEdate, c_amt, c_vatType, ...diffs } = diffItem;
          if (contSdate || contEdate) {
            chgContContents.push({
              key: "date",
              text: "계약기간",
              before: [source.contSdate, source.contEdate]
                .map((date) => fn.convDate(dayjs, date, "YYYY-MM-DD"))
                .join(" ~ "),
              after: [target.contSdate, target.contEdate]
                .map((date) => fn.convDate(dayjs, date, "YYYY-MM-DD"))
                .join(" ~ "),
            });
          }
          if (c_amt || c_vatType) {
            const vatArr = { suppAmt: "(VAT 별도)", contAmt: "(VAT 포함)" };
            const sAmt = fn.numberWithCommas(source.c_amt);
            const tAmt = fn.numberWithCommas(target.c_amt);
            chgContContents.push({
              key: "amt",
              text: "계약총금액",
              before: [sAmt, vatArr[source.c_vatType]].join(" "),
              after: [tAmt, vatArr[target.c_vatType]].join(" "),
            });
          }
          if (diffs && Object.keys(diffs).length > 0) {
            const diffKeyMapping = {
              c_paymentTerms: "지급조건",
              c_claimsTime: "청구시점",
              c_contractDeposit: "계약이행보증",
              c_firstPaymentReturnDeposit: "선급금보증",
              c_warrHajaDeposit: "하자이행보증",
              c_delayedMoney: "지체상금율",
              c_etc: "기타",
              c_attach: "첨부서류",
            };
            Object.keys(diffs).forEach((key) => {
              chgContContents.push({
                key,
                text: diffKeyMapping[key] || "No KeyMapping",
                before: source[key],
                after: target[key],
              });
            });
          }

          draft.response.body = {
            E_MESSAGE: "전자계약 생성 시\n변경될 내역이\n조회되었습니다",
            E_STATUS: "S",
            lastSeq,
            newData,
            latestData,
            list: chgContContents,
          };
          break;
        }
        case "APPROVAL": {
          if (!currentUser.email) {
            draft.response.body = {
              E_MESSAGE: "사용자 이메일 정보가 없습니다",
              E_STATUS: "F",
              interfaceID,
              newData,
            };
            return;
          }
          const title_prefix = [
            form.type === "P" ? "매입" : "매출",
            form.seq !== "0" && `${form.seq}차 변경계약`,
            form.status === "CNL" && "계약 해지",
          ]
            .filter(Boolean)
            .join("-");

          /** content */
          const contentObj = {
            labels: {
              url: "계약조회 URL",
              contractId: "계약번호",
              status: "계약상태",
              name: "계약서명",
              postDate: "작성일",
              remark: "비고",
            },
            values: {
              url: ["https://bsg.support/ccs/p", form.contractID].join("/"),
              contractId: form.contractID,
              status: form.status,
              name: form.name,
              postDate: form.prod_date,
              remark: args.approvalDialog.remark,
            },
            styles: {
              status: "display:none;",
            },
          };
          if (form.status === "CNL") {
            contentObj.labels.postDate = "계약기간";
            contentObj.values.postDate = [form.start_date, form.end_date].join(
              " ~ "
            );
            const curr = fn.numberWithCommas(form.dmbtr);
            const cAmt = [curr, form.curr_key].join(" ");
            contentObj.labels.dmbtr = "계약금액";
            contentObj.values.dmbtr = cAmt;
          } else if (form.seq !== "0") {
            const lastSeq = (Number(form.seq) - 1).toString();
            const getLatestData = await sql("mysql", sqlParams)
              .select(tables.changed_contract.name)
              .where("contract_id", "like", `${form.id}`)
              .where("seq", "like", lastSeq)
              .run();
            const latestData = tryit(() => getLatestData.body.list[0], {});
            const latestJsonData = latestData && latestData.json;
            if (latestJsonData) {
              const latest = fn.numberWithCommas(latestJsonData.form.dmbtr);
              const lAmt = [latest, latestJsonData.form.curr_key].join(" ");
              const curr = fn.numberWithCommas(form.dmbtr);
              const cAmt = [curr, form.curr_key].join(" ");
              const changedArr = ["변경전:", lAmt, "\t=>\t", "변경후:", cAmt];
              if (latestJsonData.form.dmbtr !== form.dmbtr) {
                contentObj.labels.dmbtr = "계약금액";
                contentObj.values.dmbtr = changedArr.join(" ");
              } else {
                contentObj.labels.dmbtr = "계약금액";
                contentObj.values.dmbtr = [cAmt].concat("(동일)").join(" ");
              }
            }
          }

          /**  workflows */
          const latestApr = args.approvalList.find(
            ({ id }) => id === form.gpro_document_no
          );
          const rcp_workflows = (latestApr && latestApr.gpro_workflows) || [];

          const jsonData = {
            title: [`[${title_prefix}]`, form.name].join(" "),
            bukrs: currentUser.bukrs,
            content: contentObj,
            workflows: [{ email: currentUser.email, type: "DRF" }].concat(
              rcp_workflows
                .map(({ userId, organizationId }) => {
                  const defaultObj = { type: "REF" };
                  if (userId) {
                    defaultObj.userId = userId;
                  } else defaultObj.organizationId = organizationId;
                  return defaultObj;
                })
                .filter(({ userId }) => !!userId)
            ), //   REF 참조, RCP: 열람
          };

          draft.response.body = {
            E_MESSAGE: "",
            E_STATUS: "S",
            interfaceID,
            newData,
            jsonData,
          };
          break;
        }
        case "NEW": {
          const jsonData = get_Unipost_JSON(newData);
          const createChangedContractData = await sql("mysql", sqlParams)
            .insert(tables.changed_contract.name, {
              contract_id: form.id,
              seq: form.seq,
              json: JSON.stringify({ form, ...args }),
              before: JSON.stringify({}),
              after: JSON.stringify(jsonData),
            })
            .onConflict(["id", "seq"])
            .merge()
            .run();

          const changedContractData = await sql("mysql", sqlParams)
            .select(tables.changed_contract.name)
            .where("contract_id", "like", `${form.id}`)
            .where("seq", "like", form.seq)
            .run();
          const dbData = tryit(() => changedContractData.body.list, []);
          draft.response.body = {
            E_MESSAGE: "변경내역 조회가 완료되었습니다",
            E_STATUS: "S",
            interfaceID,
            newData,
            jsonData,
            createChangedContractData,
            dbData,
          };
          break;
        }
        case "CHANGE": {
          const lastSeq = (Number(form.seq) - 1).toString();
          const getLatestData = await sql("mysql", sqlParams)
            .select(tables.changed_contract.name)
            .where("contract_id", "like", `${form.id}`)
            .where("seq", "like", lastSeq)
            .run();
          const latestData = tryit(() => getLatestData.body.list[0], {});
          const latestJsonData = latestData && latestData.after;
          if (!latestJsonData) {
            draft.response.body = {
              E_MESSAGE: "이전 차수 계약정보가\n없습니다",
              E_STATUS: "F",
              newData,
              latestData,
            };
            return;
          }
          const jsonData = get_Unipost_JSON(newData);
          await sql("mysql", sqlParams)
            .insert(tables.changed_contract.name, {
              contract_id: form.id,
              seq: form.seq,
              json: JSON.stringify({ form, ...args }),
              before: JSON.stringify(latestJsonData),
              after: JSON.stringify(jsonData),
            })
            .onConflict()
            .merge()
            .run();

          const changedContractData = await sql("mysql", sqlParams)
            .select(tables.changed_contract.name)
            .where("contract_id", "like", `${form.id}`)
            .run();
          const dbData = tryit(() => changedContractData.body.list, []);

          /** GET Diff latestJsonData vs jsonData */
          const source = latestJsonData.contInfo.contDocValues;
          const target = jsonData.contInfo.contDocValues;

          const diffItem = Object.keys(target).reduce((acc, curr) => {
            if (target[curr] !== source[curr]) {
              acc[curr] = { before: source[curr], after: target[curr] };
            }
            return acc;
          }, {});

          const chgContContents = [];
          const {
            contSdate,
            contEdate,
            c_amt,
            c_vatType,
            c_claimsTime,
            ...diffs
          } = diffItem;
          if (contSdate || contEdate) {
            //
          }
          chgContContents.push({
            c_rowType: "date",
            c_rowName: "계약기간",
            before_contSdate: source.contSdate,
            before_contEdate: source.contEdate,
            contSdate: target.contSdate,
            contEdate: target.contEdate,
          });

          if (c_amt || c_vatType) {
            //
          }
          chgContContents.push({
            c_rowType: "amt",
            c_rowName: "계약총금액",
            before_amt: source.c_amt,
            before_vatType:
              source.c_vatType === "VAT 별도" ? "suppAmt" : "contAmt",
            c_amt: target.c_amt,
            c_vatType: target.c_vatType === "VAT 별도" ? "suppAmt" : "contAmt",
          });
          chgContContents.push({
            c_rowType: c_claimsTime,
            c_rowName: "청구시점",
            before_content: source.c_claimsTime,
            content: target.c_claimsTime,
          });
          if (diffs && Object.keys(diffs).length > 0) {
            const diffKeyMapping = {
              c_paymentTerms: "지급조건",
              c_claimsTime: "청구시점",
              c_contractDeposit: "계약이행보증",
              c_firstPaymentReturnDeposit: "선급금보증",
              c_warrHajaDeposit: "하자이행보증",
              c_delayedMoney: "지체상금율",
              c_etc: "기타",
              c_attach: "첨부서류",
            };
            Object.keys(diffs).forEach((key) => {
              chgContContents.push({
                c_rowType: key,
                c_rowName: diffKeyMapping[key] || "No KeyMapping",
                before_content: source[key],
                content: target[key],
              });
            });
          }

          draft.response.body = {
            E_MESSAGE: "변경내역 조회가 완료되었습니다",
            E_STATUS: "S",
            newData,
            latestData,
            dbData,
            diffItem,
            jsonData: {
              contInfo: {
                apiUserKey: form.id,
                // apiUserData: "연동 DATA",
                templateNo,
                orgContNo: form.uni_contno,
                orgContSeq: lastSeq,
                contName: form.name,
                contDate: fn.convDate(dayjs, form.prod_date, "YYYY-MM-DD"),
                contDocNo: form.id,
                contDocValues: { chgContContents },
              },
            },
          };
          break;
        }
        default: {
          draft.response.body = { E_MESSAGE: "Wrong contType", E_STATUS: "F" };
          break;
        }
      }

      break;
    }
    case "IF-CT-109": {
      const { contractID } = newData;
      const changedData = await sql("mysql", sqlParams)
        .select(tables.change.name)
        .where("row_key", "like", `${contractID}`)
        .orWhere("row_key", "like", `${contractID}%`)
        .orderBy("changed_at")
        .run();

      const chagedList = tryit(() => changedData.body.list, []);
      const convFn = (type = "") =>
        chagedList
          .filter((list) => list.type === type)
          .map(({ changed_at, changed_by, content }) => ({
            changed_at: fn.convDate(dayjs, changed_at),
            changed_by,
            content: JSON.stringify(content),
          }));

      draft.response.body = {
        E_MESSAGE: "변경내역 조회가 완료되었습니다",
        E_STATUS: "S",
        contractID,
        // chagedList,
        history: {
          contract: convFn("contract"),
          partyList: convFn("party"),
          costObjectList: convFn("cost_object"),
          wbsList: convFn("wbs"),
          billList: convFn("bill"),
          attachmentList: convFn("attachment"),
        },
      };
      break;
    }
    default: {
      draft.response.body = { E_MESSAGE: "Wrong Interface ID", E_STATUS: "F" };
      break;
    }
  }
  function get_ClaimsTime(arr = []) {
    return arr
      .map(({ remark, dmbtr_supply, dmbtr_vat, post_date }) => {
        const cRemark = ["▷", remark].join("");
        const suppAmt = fn.numberWithCommas(dmbtr_supply);
        const cSuppAmt = ["공급가액: ₩", suppAmt].join("");
        const taxAmt = fn.numberWithCommas(dmbtr_vat);
        const cTaxAmt = ["부가세: ₩", taxAmt].join("");
        const billDate = fn.convDate(dayjs, post_date, "YYYY-MM-DD");
        const cBillDate = ["청구시점:", billDate].join(" ");
        return [cRemark, cSuppAmt, cTaxAmt, cBillDate].join("\t");
      })
      .join("\n");
  }
  function addTextIfExist(str, tag = "%") {
    return (str && [str, tag].join(" ")) || "해당없음";
  }
  function get_Unipost_JSON(newData) {
    const { templateNo, form, ...args } = newData;
    const { partyList, attachmentList, payment_termList, billList } = args;

    const signerList = partyList.map((party, idx) =>
      party.stems10 === "1" ||
      (party.stems10 === "2" && party.gl_group_id !== "3000")
        ? {
            signerName: party.stems10_ko,
            coRegno: party.id_no, // 사업자번호
            coName: party.name,
            coOwnNm: party.prdnt_name, // 대표자
            coAddr: party.address, // 주소
            usName: party.name, // 담당자
            usCellno: `010-0000-000${idx}`, // 담당 연락처
            usEmail: `xxx${idx}@unipost.co.kr`, // 담당 메일
          }
        : {
            signerName: party.stems10_ko,
            coRegno: party.id_no, // 사업자번호
            coName: party.name,
            coOwnNm: party.prdnt_name, // 대표자
            coAddr: party.address, // 주소
            usName: party.name, // 담당자
            usCellno: `010-0000-000${idx}`, // 담당 연락처
            usEmail: `xxx${idx}@unipost.co.kr`, // 담당 메일
          }
    );
    const billTo = partyList.find((party) => party.stems10 === "2");
    const c_vatType = billTo.gl_group_id !== "3000" ? "suppAmt" : "contAmt";
    const fPaymentTerm =
      payment_termList.find((term) => term.key === form.payment_terms) || {};
    const c_paymentTerms = fPaymentTerm.text;

    const attachments = attachmentList.map(({ name = "", desc = "" }, idx) => {
      const flag = `${idx + 2}.`;
      const fileName = name.replace(/\.([^.]+)$/, "");
      return [flag, desc || fileName].join(" ");
    });
    const c_attach = ["1. 보안서약서", ...attachments].join(" \n");
    return {
      contInfo: {
        apiUserKey: form.contractID,
        templateNo,
        contName: form.name,
        contDate: fn.convDate(dayjs, form.prod_date, "YYYY-MM-DD"),
        contDocNo: form.id,
        signerList,
        contDocValues: {
          contSdate: form.start_date,
          contEdate: form.end_date,
          c_amt: `${Number(form.dmbtr_supply)}`,
          c_vatType, // 부가세 텍스트
          c_paymentTerms, // 지급조건
          c_claimsTime: get_ClaimsTime(billList), // 청구시점
          c_contractDeposit: addTextIfExist(form.contract_deposit), // 계약이행보증
          c_firstPaymentReturnDeposit: addTextIfExist(
            form.f_payment_return_deposit
          ), // 선급금보증
          c_warrHajaDeposit: addTextIfExist(form.warr_haja_deposit), // 하자이행보증
          c_delayedMoney: addTextIfExist(form.delayed_money, "/ 1000"), // 지체상금율
          c_etc: form.etc,
          c_attach,
        },
      },
    };
  }
};
