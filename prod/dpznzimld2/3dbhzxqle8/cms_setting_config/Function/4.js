module.exports = async (draft) => {
  const formSetting = { sizeV2: true, columnsXL: 2, columnsL: 2, columnsM: 2 };
  draft.response.body = {
    ...draft.response.body,
    settings: {
      forms: [
        {
          ...formSetting,
          id: "env",
          title: "기준정보",
          containers: [
            {
              fields: [
                {
                  id: "import",
                  label: "",
                  text: "송신 정보 수정",
                  type: "Button",
                  properties: {},
                },
                {
                  id: "export",
                  label: "",
                  text: "수신 정보 수정",
                  type: "Button",
                  properties: {},
                },
                {
                  id: "companyID",
                  label: "",
                  text: "회사코드 수정",
                  type: "Button",
                  properties: {},
                },
              ],
            },
          ],
        },
        {
          ...formSetting,
          id: "card",
          title: "법인카드",
          containers: [
            {
              fields: [
                {
                  id: "taxCodes",
                  label: "",
                  text: "세금코드 수정",
                  type: "Button",
                  properties: {},
                },
                {
                  id: "ledgerCodes",
                  label: "",
                  text: "계정과목 수정",
                  type: "Button",
                  properties: {},
                },
                {
                  id: "costCenters",
                  label: "",
                  text: "코스트센터 수정",
                  type: "Button",
                  properties: {},
                },
                {
                  id: "enrollCardData",
                  label: "",
                  text: "카드정보 등록",
                  type: "Button",
                  properties: {},
                },
              ],
            },
          ],
        },
      ],
    },
  };
};
