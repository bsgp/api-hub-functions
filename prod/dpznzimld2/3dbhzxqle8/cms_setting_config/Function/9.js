module.exports = async (draft, { request, file }) => {
  const type = request.params.type;
  const path = [`cms/setting_config/ledgerList.json`].join("");
  let items;
  try {
    const savedDataStr = await file.get(path);
    const savedData = JSON.parse(savedDataStr);
    items = savedData.items;
  } catch (error) {
    draft.response.body.error = error.message;
    items = [];
  }
  const formSetting = { sizeV2: true, columnsXL: 2, columnsL: 2, columnsM: 2 };
  draft.response.body = {
    ...draft.response.body,
    type,
    settings: {
      dialogs: [
        {
          id: "ledgerCodes",
          fullSize: true,
          forms: [
            {
              ...formSetting,
              id: "ledgerCodes",
              containers: [
                {
                  title: "계정과목 수정",
                  fields: [
                    {
                      id: "ledgerCodes",
                      label: "",
                      text: "계정과목 수정 후 저장버튼을 눌러주세요",
                      properties: {},
                    },
                  ],
                },
              ],
            },
          ],
          tables: [
            {
              id: "ledgerList",
              title: "계정과목 정보",
              mode: "MultiSelect",
              select: "onSelectRow",
              toolbars: [
                { id: "add", text: "추가" },
                { id: "delete", text: "삭제" },
                { id: "save", text: "저장" },
              ],
              columns: [
                {
                  id: "ID",
                  text: "ID",
                  type: "Input",
                  properties: {},
                },
                {
                  id: "TEXT",
                  text: "TEXT",
                  type: "Input",
                  properties: {},
                },
                {
                  id: "COMPANY_ID",
                  text: "COMPANY_ID",
                  type: "Input",
                  properties: {},
                },
                {
                  id: "COUNTRY_CODE",
                  text: "COUNTRY_CODE",
                  type: "Input",
                  properties: {},
                },
              ],
              items,
            },
          ],
        },
      ],
    },
  };
};
