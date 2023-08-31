module.exports = async (draft, { env, odata, soap, sql, user }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { BYD_URL, BYD_ODATA_PATH, BYD_ID, BYD_PW } = env;
  const { requestData, tableConfig } = draft.json;
  const { companyID, invoiceDate, invDescription, rows } = requestData;

  const CARD_NO = getCardNoFormatStr(rows[0].CARD_NO);

  // 1. OData로 (카드번호 -> 공급업체 ID) 조회하기
  const odataResponse = await odata.get({
    url: [
      BYD_URL,
      BYD_ODATA_PATH,
      "cust/v1/card_from_supplier_odata_connect/SupplierCollection",
      "?$format=json&$inlinecount=allpages&$top=9999",
      "&$select=InternalID,CityName",
      `&$filter=CityName eq '${CARD_NO}'`,
      "&$orderby=InternalID",
    ].join(""),
    username: BYD_ID,
    password: BYD_PW,
  });

  if (odataResponse.ResponseError) {
    setFailedResponse(odataResponse.ResponseError, "500");
    return;
  }

  const results_odata = odataResponse.d.results;
  if (
    !Array.isArray(results_odata) ||
    results_odata.length === 0 ||
    !results_odata[0].InternalID
  ) {
    setFailedResponse(
      `해당 카드번호[${CARD_NO}]로는 공급업체 ID를 찾을 수 없습니다`
    );
    return;
  }
  const SUPPLIER_ID = results_odata[0].InternalID;

  // 2. 비동기적으로 송장 생성 & DB 업데이트
  const result = await execAsync({ env, odata, soap, sql, user }, tableConfig, {
    companyID,
    invoiceDate,
    invDescription,
    CARD_NO,
    SUPPLIER_ID,
    rows,
  });
  if (result.status === "rejected") {
    setFailedResponse(result.reason);
    return;
  }

  draft.response.body = { E_STATUS: "S", ...result };
  draft.json.nextNodeKey = routeTo.exit;
};

async function execAsync(context, tableConfig, rowData) {
  // const { soap, env, sql, user } = context;
  // const { BYD_TENANT } = env;
  const { companyID, invoiceDate, invDescription, CARD_NO, SUPPLIER_ID, rows } =
    rowData;

  try {
    // #1. VAT * 10 === APPR_AMT 여부로 correct/incorrect 나누기
    const filteredRows = {
      correct: [],
      incorrect: [],
    };
    rows.forEach((row) => {
      if (row.VAT * 10 === row.APPR_AMT) {
        filteredRows.correct.push(row);
      } else {
        filteredRows.incorrect.push(row);
      }
    });

    // payload 처리를 위한 리스트 형식
    // const payloadList = [{ rows: [], payload: {} }];
    const payloadList = [];

    // #2-1. correct 같은 경우, 하나의 송장 내에 여러 item 들을 넣기
    // (50개 단위로 넣기)
    for (let idx = 0; idx < filteredRows.correct.length; idx += 50) {
      const sliced = filteredRows.correct.slice(idx, idx + 50);

      // 기본 payload 생성
      const payload = getBasePayload({
        companyID,
        invoiceDate,
        invDescription,
        SUPPLIER_ID,
        row: sliced[0],
      });
      // Item 에 항목들 넣기
      payload.SupplierInvoice.Item.push(
        ...sliced.map((row, index) =>
          getItemData(row, companyID, CARD_NO, index + 1)
        )
      );
      // VAT * 10 === APPR_AMT 가 성립되는 row 목록이므로, 총액을 합산하기
      payload.SupplierInvoice["GrossAmount"] = {
        currencyCode: "",
        _value_1: sliced.reduce(
          (accumulator, row) => accumulator + (row.APPR_AMT + row.VAT),
          0
        ),
      };

      payloadList.push({ rows: sliced, payload: payload });
    }

    // #2-2. incorrect 같은 경우, 개별의 송장을 만든다
    filteredRows.incorrect.forEach((row) => {
      // 기본 payload 생성
      const payload = getBasePayload({
        companyID,
        invoiceDate,
        invDescription,
        SUPPLIER_ID,
        row,
      });
      // Item 에 항목 넣기
      payload.SupplierInvoice.Item.push(
        getItemData(row, companyID, CARD_NO, 1)
      );
      // 일단은 총액 데이터를 넣기... (ByD 상에서 오류 예외 처리했을 것임)
      payload.SupplierInvoice["GrossAmount"] = {
        currencyCode: "",
        _value_1: row.APPR_AMT_TOT,
      };
      // 일단은 부가세 데이터를 넣기... (ByD 상에서 오류 예외 처리했을 것임)
      payload.SupplierInvoice["TaxAmount"] = {
        currencyCode: "",
        _value_1: row.VAT,
      };

      payloadList.push({ rows: [row], payload: payload });
    });

    // #3. SOAP 송장생성 & DB에 업데이트
    const results_invoice = await Promise.all(
      payloadList.map((unit) =>
        createInvoiceAsync(context, tableConfig, unit.rows, unit.payload)
      )
    );

    return { status: "fulfilled", value: results_invoice };
  } catch (error) {
    return { status: "rejected", reason: error.message };
  }
}

async function createInvoiceAsync(context, tableConfig, rows, payload) {
  const { soap, env, sql, user } = context;
  const { BYD_TENANT, SOAP_ID, SOAP_ID_QUERY, SOAP_PASSWORD } = env;

  try {
    // 1. SOAP 요청하기
    // API Hub에서 File 탭 > ID: manage_supplier_invoices > Aliases: main 으로 잡음
    const { statusCode, body } = await soap(`manage_supplier_invoices:main`, {
      tenantID: BYD_TENANT,
      username: SOAP_ID,
      password: SOAP_PASSWORD,
      operation: "MaintainBundle",
      payload,
    });
    if (Math.floor(statusCode / 100) !== 2) {
      const { soap_error } = body;
      throw new Error(soap_error.map((row) => row.message).join("\n"));
    }

    const { SupplierInvoice } = JSON.parse(body);
    const newSupplierInvoiceNo =
      SupplierInvoice[0].BusinessTransactionDocumentID._value_1;

    // 송장번호가 확인되지 않으면  => 에러 throw
    if (!newSupplierInvoiceNo) {
      throw new Error("신규 생성되는 송장 번호가 확인되지 않음");
    }

    // 2. 제대로 생성된 송장인지 확인하기
    // API Hub에서 File 탭 > ID: query_supplier_invoices > Aliases: main 으로 잡음
    // queryResult = { statusCode, body }
    const queryResult = await soap("query_supplier_invoices:main", {
      tenantID: BYD_TENANT,
      username: SOAP_ID_QUERY,
      password: SOAP_PASSWORD,
      operation: "FindSimpleByElements",
      payload: {
        SupplierInvoiceSimpleSelectionByElements: {
          SelectionByID: {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryID: newSupplierInvoiceNo,
          },
        },
        ProcessingConditions: {
          QueryHitsUnlimitedIndicator: true,
        },
      },
    });

    if (Math.floor(queryResult.statusCode / 100) !== 2) {
      const { soap_error } = queryResult.body;
      throw new Error(soap_error.map((row) => row.message).join("\n"));
    }

    const queryBody =
      typeof queryResult.body === "string"
        ? JSON.parse(queryResult.body)
        : queryResult.body;

    // 송장 상태 코드 가져오기
    let SupplierInvoiceLifeCycleStatusCode;
    try {
      SupplierInvoiceLifeCycleStatusCode = queryBody.SupplierInvoice[0];
      SupplierInvoiceLifeCycleStatusCode =
        SupplierInvoiceLifeCycleStatusCode.Status;
      SupplierInvoiceLifeCycleStatusCode =
        SupplierInvoiceLifeCycleStatusCode.SupplierInvoiceLifeCycleStatusCode;
    } catch (error) {
      throw new Error(["송장 상태 확인 불가 >> ", error.message].join(""));
    }

    // 3. 송장 상태가 "8"(송장 게시 완료) 이라면?   -> DB 업데이트 진행
    let dbUpdateResult;
    if (SupplierInvoiceLifeCycleStatusCode === "8") {
      const { tableName, primaryKeys } = tableConfig;
      const mysql = sql("mysql");

      const sqlPromises = rows.map((row) =>
        mysql
          .update(tableName, {
            // 송장번호
            INVOICE_NO: newSupplierInvoiceNo,
            // 송장생성날짜 (= 오늘)
            INVOICE_DATE: getTodayStr(""),
            // 계정코드
            ACCOUNT_CD: row.ACCOUNT_CD,
            ACCOUNT_NAME: row.ACCOUNT_NAME,
            // 세금코드
            TAX_CD: row.TAX_CD,
            TAX_NAME: row.TAX_NAME,
            // 계정지정유형
            ACCOUNT_DESIGNATION_TYPE_CD: row.ACCOUNT_DESIGNATION_TYPE_CD,
            // 코스트센터
            COST_CENTRE_NO: row.COST_CENTRE_NO,
            COST_CENTRE_NAME: row.COST_CENTRE_NAME,
            // 프로젝트
            PROJECT_NO: row.PROJECT_NO,
            PROJECT_NAME: row.PROJECT_NAME,
            // 판매오더
            SALES_ORDER_NO: row.SALES_ORDER_NO,
            SALES_ORDER_NAME: row.SALES_ORDER_NAME,
            // 판매오더아이템
            SALES_ORDER_ITEM_NO: row.SALES_ORDER_ITEM_NO,
            SALES_ORDER_ITEM_NAME: row.SALES_ORDER_ITEM_NAME,
            // 불공제사유
            NON_DEDUCTION_REASON_CD: row.NON_DEDUCTION_REASON_CD,
            // 적요
            SUMMARY: row.SUMMARY,
            // 업데이트한 사용자
            UPDATED_BY: user.id,
            // 업데이트 날짜
            UPDATED_AT: mysql.fn.now(6),
          })
          .where({
            HIST_ROW_KEY: row.HIST_ROW_KEY,
          })
          .onConflict(primaryKeys)
          .ignore()
          .run()
      );
      dbUpdateResult = await Promise.all(sqlPromises);
    }
    return {
      status: "fulfilled",
      histRowKeys: rows.map((row) => row.HIST_ROW_KEY),
      value: {
        newSupplierInvoiceNo,
        SupplierInvoiceLifeCycleStatusCode,
        // payload,
        // confirmResult,
        dbUpdateResult,
      },
    };
  } catch (error) {
    return {
      status: "rejected",
      histRowKeys: rows.map((row) => row.HIST_ROW_KEY),
      reason: error.message,
    };
  }
}

function getBasePayload(rowData) {
  const { companyID, invoiceDate, invDescription, SUPPLIER_ID } = rowData;

  return {
    BasicMessageHeader: {},
    SupplierInvoice: {
      // SupplierInvoice 노드의 옵션 설정값
      actionCode: "01",
      itemListCompleteTransmissionIndicator: true,
      // 송장 유형 (송장: 004)
      BusinessTransactionDocumentTypeCode: "004",
      // 송장 내역
      MEDIUM_Name: invDescription,
      // 송장 일자
      Date: invoiceDate,
      // 입고일 (문서일자보다 빠를 수 없음!)
      ReceiptDate: invoiceDate,
      // 전기일
      TransactionDate: invoiceDate,
      // 가격이 총 기준(true)인지 아니면 순 기준(false)인지 표시
      DocumentItemGrossAmountIndicator: false,
      // 총액 (= 순 금액 + 세금 금액)
      // GrossAmount: {
      //     currencyCode: "",
      //     _value_1: rows.reduce(
      //         (accumulator, row) => accumulator + (row.APPR_AMT + row.VAT),
      //         0
      //     )
      // },
      // 세금 금액
      // TaxAmount: {
      //     currencyCode: "",
      //     _value_1: rows.reduce(
      //         (accumulator, row) => accumulator + row.VAT,
      //         0
      //     )
      // },
      // 송장 생성 상태 (2: 초기생성, 3: 전기처리)
      Status: {
        DataEntryProcessingStatusCode: "3",
      },
      // 외부 전표 ID (= MEDIUM_Name)
      CustomerInvoiceReference: {
        actionCode: "01",
        BusinessTransactionDocumentReference: {
          // ID: row.HIST_ROW_KEY.slice(-18),
          ID: getDateCode(),
          TypeCode: "28",
        },
      },
      // 구매 회사의 ID (200: 자회사)
      BuyerParty: {
        actionCode: "01",
        PartyKey: { PartyTypeCode: "200", PartyID: companyID },
      },
      // 청구 대상 회사의 ID (200: 자회사)
      BillToParty: {
        actionCode: "01",
        PartyKey: { PartyTypeCode: "200", PartyID: companyID },
      },
      // 청구하는 회사의 ID (147: 공급업체)
      BillFromParty: {
        actionCode: "01",
        PartyKey: { PartyTypeCode: "147", PartyID: SUPPLIER_ID },
      },
      // 공급 업체 (카드번호로 조회하기) (147: 공급업체)
      SellerParty: {
        actionCode: "01",
        PartyKey: { PartyTypeCode: "147", PartyID: SUPPLIER_ID },
      },
      // 항목
      Item: [],
    },
  };
}

function getItemData(row, companyID, CARD_NO, index = 1) {
  const itemData = {
    // SupplierInvoice 노드의 옵션 설정값
    actionCode: "01",
    ObjectNodeSenderTechnicalID: index,
    // 공급 업체 송장 품목의 유형 (002: 송장 내 품목)
    BusinessTransactionDocumentItemTypeCode: "002",
    // 항목 ID
    // ItemID: row.SALES_ORDER_ITEM_NO,
    ItemID: index,
    // 항목 내역
    SHORT_Description: row.SUMMARY,
    // 항목 수량 & 단위코드 (= "EA")
    // Quantity: { unitCode: "EA", _value_1: 1 },
    // 항목 순액
    NetAmount: { currencyCode: row.CUR_CD, _value_1: row.APPR_AMT },
    // 항목 수량 당 정가
    // NetUnitPrice: {
    //     Amount: { currencyCode: row.CUR_CD, _value_1: row.APPR_AMT_TOT },
    //     // NetUnitPrice가 적용되는 품목의 기본 수량
    //     BaseQuantity: 1,
    // },
    // 항목의 세금 정보
    ProductTax: {
      actionCode: "01",
      ObjectNodePartyTechnicalID: 1,
      ProductTaxationCharacteristicsCode: {
        listID: "KR",
        _value_1: row.TAX_CD,
      },
      CountryCode: "KR",
    },
    AccountingCodingBlockDistribution: {
      ActionCode: "01",
      CompanyID: companyID,
      HostObjectTypeCode: "127",
      AccountingCodingBlockAssignment: {
        ActionCode: "01",
        // ByD 의 G/L 계정 ID와 동일하게 전송
        GeneralLedgerAccountAliasCode: {
          listID: "KR",
          _value_1: row.ACCOUNT_CD,
        },
        // // 코스트 : CC, 프로젝트 : PRO
        // AccountingCodingBlockTypeCode: "CC",
        // // 코스트 센터 ID (AccountingCodingBlockTypeCode = 'CC'일 때만!)
        // CostCentreID: row.COST_CENTRE_NO,
        // // 프로젝트 ID (AccountingCodingBlockTypeCode = 'PRO'일 때만!)
        // ProjectTaskKey: {
        //     TaskID: row.PROJECT_NO
        // },
        // ProjectReference: {
        //     ProjectID: row.PROJECT_NO
        // },
        // (AccountingCodingBlockTypeCode = 'PRO'일 때만!)
        // SalesOrderReference: {
        //     ID: row.SALES_ORDER_NO,
        //     ItemID: row.SALES_ORDER_ITEM_NO
        // }
      },
    },
    // dev: "ysp" / prod: "y03"
    // 봉사료
    ServiceCharge: { currencyCode: row.CUR_CD, _value_1: row.TIPS },
    // 불공제사유
    NonDeductibleReasonCode: row.NON_DEDUCTION_REASON_CD,
    // 카드번호
    Z_CardNumber: CARD_NO,
    // 가맹점명
    MerchantName: row.MERCH_NAME,
    // 카드승인번호
    Z_CardApprovalNumber: row.APPR_NO,
    // 카드사용일 (YYYY-MM-DD)
    CreditCardUseDate: getDateFormatStr(row.APPR_DATE, "-"),
    // 가맹점등록번호 (000-00-00000)
    MerchantBusinessRegistrationNumber: getBusinessIDFormatStr(
      row.MERCH_BIZ_NO
    ),
  };

  // 코스트센터 <-> 프로젝트 여부에 따라 다르게 payload 작성
  const cursor_acnt =
    itemData.AccountingCodingBlockDistribution.AccountingCodingBlockAssignment;

  switch (row.ACCOUNT_DESIGNATION_TYPE_CD) {
    // 코스트 센터  -> [코스트 센터]만 입력
    case "1": {
      cursor_acnt.AccountingCodingBlockTypeCode = "CC";
      cursor_acnt.CostCentreID = row.COST_CENTRE_NO;
      break;
    }
    // 프로젝트    -> [프로젝트 코드, 판매오더, 판매오더 아이템] 모두 입력
    case "2": {
      cursor_acnt.AccountingCodingBlockTypeCode = "PRO";
      cursor_acnt.ProjectTaskKey = {
        TaskID: row.PROJECT_NO,
      };
      cursor_acnt.ProjectReference = {
        ProjectID: row.PROJECT_NO,
      };
      cursor_acnt.SalesOrderReference = {
        ID: row.SALES_ORDER_NO,
        ItemID: row.SALES_ORDER_ITEM_NO,
      };
      break;
    }
  }

  return itemData;
}

function getDateFormatStr(yyyymmdd, separator = "-") {
  return [yyyymmdd.slice(0, 4), yyyymmdd.slice(4, 6), yyyymmdd.slice(6)].join(
    separator
  );
}

function getCardNoFormatStr(cardNo) {
  return [
    cardNo.slice(0, 4),
    cardNo.slice(4, 8),
    cardNo.slice(8, 12),
    cardNo.slice(12),
  ].join("-");
}

function getBusinessIDFormatStr(businessID) {
  return [
    businessID.slice(0, 3),
    businessID.slice(3, 5),
    businessID.slice(5),
  ].join("-");
}

function getTodayStr(separator = "-") {
  const dateObj = new Date();

  const year = dateObj.getFullYear().toString();
  const month = `000${dateObj.getMonth() + 1}`.slice(-2);
  const date = `000${dateObj.getDate()}`.slice(-2);

  return [year, month, date].join(separator);
}

function getDateCode() {
  const now = new Date();
  return [
    now.getFullYear(),
    "-",
    `000${now.getMonth() + 1}`.slice(-2),
    "-",
    `000${now.getDate()}`.slice(-2),
    "_",
    `000${now.getHours()}`.slice(-2),
    ":",
    `000${now.getMinutes()}`.slice(-2),
    ":",
    `000${now.getSeconds()}`.slice(-2),
    "_",
    `000${Number.parseInt(Math.random() * 10000000000)}`.slice(-10),
  ].join("");
}
