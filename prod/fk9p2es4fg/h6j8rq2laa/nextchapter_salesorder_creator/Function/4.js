module.exports = async (draft, { file }) => {
  if (!draft.json.fileName) {
    return;
  }
  const fileName = draft.json.fileName;
  const dataStr = await file.get(fileName);
  const data = JSON.parse(dataStr);

  const getPayload = (data) => {
    const payload = {
      BasicMessageHeader: {},
      SalesOrder: {
        BuyerID: data.id,
        PostingDate: data.date && `${data.date}T09:00:00Z`, // 전기일
        Name: "",
        ReleaseCustomerRequest: true,
        DataOriginTypeCode: "4",
        BillToParty: { PartyID: data.marketplaceCode }, // 청구처
        AccountParty: { PartyID: data.marketplaceCode }, // 계정
        ProductRecipientParty: { PartyID: data.marketplaceCode }, // 납품처
        EmployeeResponsibleParty: {
          PartyID: data.branchCode, // 책임자(조직지정)
        },
        SalesAndServiceBusinessArea: { DistributionChannelCode: "01" },
        SalesUnitParty: { PartyID: data.branchCode }, // 판매부서(브랜드)
        RequestedFulfillmentPeriodPeriodTerms: {
          StartDateTime: {
            _value_1: data.date && `${data.date}T09:00:00Z`,
            timeZoneCode: "UTC",
          }, // 납품요청일
        },
        PricingTerms: {
          actionCode: "01",
          CurrencyCode: "KRW",
          PriceDateTime: {
            _value_1: data.date && `${data.date}T09:00:00Z`,
            timeZoneCode: "UTC",
          },
          GrossAmountIndicator: false,
        },
        Item: [
          {
            ID: "10",
            ItemProduct: {
              ProductID: data.skuCode,
              UnitOfMeasure: data.unitType,
            },
            ShipFromItemLocation: { actionCode: "01", LocationID: "11000" },
            ItemScheduleLine: { Quantity: data.unitsSold },
            PriceAndTaxCalculationItem: {
              ItemMainPrice: {
                actionCode: "01",
                Rate: {
                  DecimalValue: Math.round((data.totalCost * 10) / 11),
                  CurrencyCode: "KRW",
                  BaseDecimalValue: data.unitsSold,
                  BaseMeasureUnitCode: data.unitType,
                },
              },
            },
          },
        ],
        PriceAndTaxCalculation: {
          PriceComponent: [
            {
              TypeCode: "3007",
              Rate: {
                DecimalValue: -Math.round(
                  ((data.totalCost - data.payCost) * 10) / 11
                ),
                CurrencyCode: "KRW",
              },
            },
          ],
        },
      },
    };
    return payload;
  };

  const salesOrderPayload = getPayload(data);
  draft.json.salesOrderPayload = salesOrderPayload;

  draft.response.body = {
    fileName,
    data,
    salesOrderPayload,
  };
};
