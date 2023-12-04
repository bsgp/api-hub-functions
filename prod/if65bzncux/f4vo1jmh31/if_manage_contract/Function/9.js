module.exports = async (draft, { sql, env, tryit, fn, dayjs }) => {
  const { interfaceID, tables, newData } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-108": {
      /**
       * type === "NEW" => INDATE at seq 0
       * * json: curr all (GET ALL DB TABLE)
       * * before: "",
       * * after: curr contDocValues
       *
       * type === "CHANGE" => INDATE at seq: curr'seq +1
       * * json: curr all (GET ALL DB TABLE)
       * * before: curr seq's changeCont,
       * * after: curr contDocValues
       */
      const { type, templateNo, form, ...args } = newData;
      const { partyList, attachmentList, payment_termList, billList } = args;
      const billToParty = partyList.find((party) => party.stems10 === "2");
      if (!billToParty) {
        draft.response.body = {
          E_MESSAGE: "계약당사자 정보가\n없습니다",
          E_STATUS: "F",
          interfaceID,
          newData,
        };
        return;
      }

      const fPaymentTerm =
        payment_termList.find((term) => term.key === form.payment_terms) || {};
      const c_paymentTerms = fPaymentTerm.text;
      const c_claimsTime = billList
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

      const addTextIfExist = (str, tag = "%") =>
        (str && [str, tag].join(" ")) || "해당없음";

      const jsonData = {
        contInfo: {
          apiUserKey: form.contractID,
          templateNo,
          contName: form.name,
          contDate: fn.convDate(dayjs, form.prod_date, "YYYY-MM-DD"),
          contDocNo: form.id,
          signerList: partyList.map((party, idx) => ({
            signerName: party.stems10_ko,
            coRegno: party.id_no, // 사업자번호
            coName: party.name,
            coOwnNm: party.prdnt_name, // 대표자
            coAddr: party.address, // 주소
            usName: party.name, // 담당자
            usCellno: `010-0000-000${idx}`, // 담당 연락처
            usEmail: `xxx${idx}@unipost.co.kr`, // 담당 메일
          })),
          contDocValues: {
            contSdate: form.start_date,
            contEdate: form.end_date,
            c_amt: `${Number(form.dmbtr_supply)}`,
            c_vatType:
              billToParty.gl_group_id !== "3000" ? "suppAmt" : "contAmt",
            // 부가세 텍스트
            c_paymentTerms, // 지급조건
            c_claimsTime, // 청구시점
            c_contractDeposit: addTextIfExist(form.contract_deposit),
            // 계약이행보증
            c_firstPaymentReturnDeposit: addTextIfExist(
              form.f_payment_return_deposit
            ), // 선급금보증
            c_warrHajaDeposit: addTextIfExist(form.warr_haja_deposit),
            // 하자이행보증
            c_delayedMoney: addTextIfExist(form.delayed_money, "/ 1000"),
            // 지체상금율
            c_etc: form.etc,
            c_attach: [
              "1. 보안서약서",
              ...attachmentList.map(({ name = "", desc = "" }, idx) => {
                const flag = `${idx + 2}.`;
                const fileName = name.replace(/\.([^.]+)$/, "");
                return [flag, desc || fileName].join(" ");
              }),
            ].join(" \n"),
          },
        },
      };

      switch (type) {
        case "NEW": {
          const createChangedContractData = await sql("mysql", sqlParams)
            .insert(tables["changed_contract"].name, {
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
            .select(tables["changed_contract"].name)
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
            .select(tables["changed_contract"].name)
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

          await sql("mysql", sqlParams)
            .insert(tables["changed_contract"].name, {
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
            .select(tables["changed_contract"].name)
            .where("contract_id", "like", `${form.id}`)
            .run();
          const dbData = tryit(() => changedContractData.body.list, []);

          /** GET Diff latestJsonData vs jsonData */
          const source = latestJsonData.contInfo.contDocValues;
          const target = jsonData.contInfo.contDocValues;

          const diffItem = Object.keys(target).reduce((acc, curr) => {
            if (target[curr] !== source[curr]) {
              acc[curr] = {
                before: source[curr],
                after: target[curr],
              };
            }
            return acc;
          }, {});

          const chgContContents = [];
          const { contSdate, contEdate, c_amt, c_vatType, ...diffs } = diffItem;
          if (contSdate || contEdate) {
            chgContContents.push({
              c_rowType: "date",
              c_rowName: "계약기간",
              before_contSdate: source.contSdate,
              before_contEdate: source.contEdate,
              contSdate: target.contSdate,
              contEdate: target.contEdate,
            });
          }
          if (c_amt || c_vatType) {
            chgContContents.push({
              c_rowType: "amt",
              c_rowName: "계약총금액",
              before_amt: source.c_amt,
              before_vatType:
                source.c_vatType === "VAT 별도" ? "suppAmt" : "contAmt",
              c_amt: target.c_amt,
              c_vatType:
                target.c_vatType === "VAT 별도" ? "suppAmt" : "contAmt",
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
            Object.keys(diffs).map((key) => {
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
        .select(tables["change"].name)
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
};
