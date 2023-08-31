module.exports = async (draft, { request, file }) => {
  const type = request.params.type;
  const path = [`cms/setting_config/taxCodeList.json`].join("");
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
          id: "enrollCardData",
          fullSize: true,
          forms: [
            {
              ...formSetting,
              id: "enrollCardData",
              containers: [
                {
                  title: "카드정보 수정",
                  fields: [
                    // {
                    //   id: "setCardData",
                    //   label: "",
                    //   type: "Radio",
                    //   items: [
                    //     { key: "all", text: "전체" },
                    //     { key: "each", text: "사용자 별" },
                    //   ],
                    //   properties: {},
                    // },
                    {
                      id: "enrollCardDataText",
                      label: "",
                      text: "카드정보 등록 후 저장버튼을 눌러주세요",
                      properties: {},
                    },
                  ],
                },
              ],
            },
          ],
          tables: [
            {
              id: "cardList",
              title: "카드등록정보",
              mode: "MultiSelect",
              select: "onSelectRow",
              toolbars: [
                {
                  id: "download",
                  text: "엑셀 다운로드",
                  icon: "sap-icon://download",
                },
                {
                  id: "upload",
                  text: "엑셀 업로드",
                  icon: "sap-icon://upload",
                  type: "FileUploader",
                },
                { id: "add", text: "추가" },
                { id: "delete", text: "삭제" },
                { id: "save", text: "저장" },
              ],
              columns: [
                {
                  id: "GUBUN",
                  text: "구분",
                  type: "Input",
                  options: { width: "10rem" },
                  properties: {},
                },
                {
                  id: "CARD_NUMBER",
                  text: "카드번호",
                  type: "Input",
                  options: {
                    mask: "9999-9999-9999-9999",
                    placeholder: "xxxx-xxxx-xxxx-xxxx",
                    width: "10rem",
                  },
                  properties: {},
                },
                {
                  id: "CODE_NUMBER",
                  text: "코드번호",
                  type: "Input",
                  options: { width: "6rem" },
                  properties: {},
                },
                {
                  id: "CARD_ENROLL_USER",
                  text: "명의자",
                  type: "Input",
                  options: { width: "5rem" },
                  properties: {},
                },
                {
                  id: "USEAGE_TEAM",
                  text: "사용부서",
                  type: "Input",
                  properties: {},
                },
                {
                  id: "PASSWORD",
                  text: "비밀번호",
                  type: "Input",
                  options: { width: "6rem" },
                  properties: {},
                },
                {
                  id: "MAX_COST_AMOUNT",
                  text: "이용한도금액(1M)",
                  type: "Input",
                  properties: {},
                },
                {
                  id: "ID",
                  text: "사용자ID",
                  type: "Input",
                  options: { width: "8rem" },
                  properties: {},
                },
                {
                  id: "NAME",
                  text: "사용자",
                  type: "Input",
                  options: { width: "5rem" },
                  properties: {},
                },
                {
                  id: "USEAGE",
                  text: "사용여부",
                  type: "Input",
                  options: { width: "5rem" },
                  properties: {},
                },
                {
                  id: "EXPIRED_IN",
                  text: "유효기간",
                  type: "Input",
                  options: {
                    mask: "9999-99",
                    placeholder: "YYYY-MM",
                    width: "6rem",
                  },
                  properties: {},
                },
                {
                  id: "DESCRIPTION",
                  text: "비고",
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
