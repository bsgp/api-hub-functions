module.exports = async (draft, { request }) => {
  const type = request.params.type;
  const formSetting = { sizeV2: true, columnsXL: 2, columnsL: 2, columnsM: 2 };
  draft.response.body = {
    ...draft.response.body,
    type,
    settings: {
      dialogs: [
        {
          id: "export",
          forms: [
            {
              ...formSetting,
              id: "export",
              containers: [
                {
                  title: "수신 정보 수정",
                  fields: [
                    {
                      id: "export",
                      label: "",
                      type: "Select",
                      items: [{ key: "bydesign", text: "ByDesign" }],
                      properties: {},
                    },
                    {
                      id: "saveImport",
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
