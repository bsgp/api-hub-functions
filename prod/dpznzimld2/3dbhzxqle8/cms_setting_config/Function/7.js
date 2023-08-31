module.exports = async (draft, { request }) => {
  const type = request.params.type;
  const formSetting = { sizeV2: true, columnsXL: 2, columnsL: 2, columnsM: 2 };
  draft.response.body = {
    ...draft.response.body,
    type,
    settings: {
      dialogs: [
        {
          id: "companyID",
          forms: [
            {
              ...formSetting,
              id: "companyID",
              containers: [
                {
                  title: "회사코드 수정",
                  fields: [
                    {
                      id: "companyID",
                      label: "",
                      type: "Input",
                      properties: {},
                    },
                    {
                      id: "saveCompany",
                      label: "",
                      text: "저장",
                      type: "Button",
                      properties: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
};
