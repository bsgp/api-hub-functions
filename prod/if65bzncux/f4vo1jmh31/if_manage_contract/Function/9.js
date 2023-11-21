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
      try {
        const fPaymentTerm =
          payment_termList.find((term) => term.key === form.payment_terms) ||
          {};
        const c_paymentTerms = fPaymentTerm.text;
        const billToParty = partyList.find((party) => party.stems10 === "2");
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

        switch (type) {
          default: {
            // type: "NEW"
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
                  suppAmt: `${Number(form.dmbtr_supply)}`,
                  c_vatSts:
                    billToParty.gl_group_id !== "3000" ? "VAT 별도" : " ",
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
            draft.response.body = {
              E_MESSAGE: "변경내역 조회가 완료되었습니다",
              E_STATUS: "S",
              // currContract,
              newData,
              jsonData,
            };
            break;
          }
        }
        // const cContractData = await sql("mysql", sqlParams)
        //   .select(tables["changed_contract"].name)
        //   // .where("contract_id", "like", `${contractID}`)
        //   // .where("seq", "like", `${seq}`)
        //   .run();
        // const currContract = tryit(() => cContractData.body.list, []);
      } catch (err) {
        draft.response.body = {
          E_MESSAGE: "변경내역 조회가 완료되었습니다",
          E_STATUS: "S",
          newData,
          args,
          errormsg: err.message,
        };
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
