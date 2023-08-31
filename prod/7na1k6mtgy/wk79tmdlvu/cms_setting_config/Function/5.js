module.exports = async (draft, { request }) => {
  const type = request.params.type;
  const formSetting = { sizeV2: true, columnsXL: 2, columnsL: 2, columnsM: 2 };
  draft.response.body = {
    ...draft.response.body,
    type,
    settings: {
      dialogs: [
        {
          id: "import",
          forms: [
            {
              ...formSetting,
              id: "import",
              containers: [
                {
                  title: "송신 정보 수정",
                  fields: [
                    {
                      id: "import",
                      label: "",
                      type: "Select",
                      items: [{ key: "kiwoong", text: "기웅정보통신" }],
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
