module.exports = async (draft, { request }) => {
  const { type } = request.params;
  const items = [];

  // const path = [`cms/setting_config/cardList.json`].join("");
  // try {
  //   const savedDataStr = await file.get(path);
  //   const savedData = JSON.parse(savedDataStr);
  //   items = savedData.items;
  // } catch (error) {
  //   draft.response.body.error = error.message;
  // }

  const formSetting = { sizeV2: true, columnsXL: 3, columnsL: 3, columnsM: 2 };
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
                  title: "사용자별 법인카드 관리",
                  fields: [
                    {
                      id: "cardUsageStatus",
                      label: "사용여부",
                      // type: "ComboBox",
                      type: "Select",
                      items: [
                        { key: "all", text: "전체" },
                        { key: "preparing", text: "준비중" },
                        { key: "yes", text: "사용" },
                        { key: "no", text: "미사용" },
                      ],
                      options: {
                        width: "10rem",
                      },
                    },
                    {
                      id: "cardUserId",
                      label: "사용자ID",
                      type: "Input",
                      options: {
                        width: "10rem",
                      },
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
              // mode: "MultiSelect",
              // select: "onSelectRow",
              toolbars: [
                { id: "search", text: "조회" },
                { id: "add", text: "추가" },
                { id: "save", text: "저장" },
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
              ],
              columns: [
                {
                  id: "CARD_CLASSIFICATION",
                  text: "구분",
                  type: "Input",
                  options: { width: "10rem", textAlign: "Left" },
                },
                {
                  id: "CARD_NUMBER",
                  text: "카드번호",
                  type: "Input",
                  options: {
                    mask: "9999-9999-9999-9999",
                    placeholder: "xxxx-xxxx-xxxx-xxxx",
                    width: "10rem",
                    textAlign: "Center",
                  },
                },
                {
                  id: "CSV_CODE",
                  text: "CSV",
                  type: "Input",
                  options: {
                    width: "6rem",
                    // type: "Password",
                    maxLength: 4,
                    textAlign: "Center",
                  },
                },
                {
                  id: "CARD_OWNER",
                  text: "명의자",
                  type: "Input",
                  options: { width: "5rem", textAlign: "Center" },
                },
                {
                  id: "CARD_USER_DEPT",
                  text: "사용부서",
                  type: "Input",
                  options: { textAlign: "Center" },
                },
                {
                  id: "PASSWORD",
                  text: "비밀번호",
                  type: "Input",
                  options: {
                    width: "6rem",
                    // type: "Password",
                    maxLength: 6,
                    textAlign: "Center",
                  },
                },
                {
                  id: "LIMIT_OF_USE",
                  text: "이용한도(1M)",
                  type: "Input",
                  options: {
                    // type: "Number",
                  },
                },
                {
                  id: "CARD_USER_ID",
                  text: "사용자ID",
                  type: "Input",
                  options: {
                    width: "8rem",
                    textAlign: "Center",
                  },
                },
                {
                  id: "USAGE_STATUS",
                  text: "사용여부",
                  type: "Select",
                  options: {
                    width: "10rem",
                    textAlign: "Center",
                  },
                  list: [
                    { key: "preparing", text: "준비중" },
                    { key: "yes", text: "사용" },
                    { key: "no", text: "미사용" },
                  ],
                },
                {
                  id: "CARD_VALID_UNTIL",
                  text: "유효기간",
                  type: "Input",
                  options: {
                    mask: "9999-99",
                    placeholder: "YYYY-MM",
                    width: "6rem",
                    textAlign: "Center",
                  },
                },
                {
                  id: "USAGE_DATE_FROM",
                  text: "사용기간 FROM",
                  type: "Input",
                  options: {
                    type: "Date",
                    width: "10rem",
                    textAlign: "Center",
                  },
                },
                {
                  id: "USAGE_DATE_TO",
                  text: "사용기간 TO",
                  type: "Input",
                  options: {
                    type: "Date",
                    width: "10rem",
                    textAlign: "Center",
                  },
                },
                {
                  id: "DESCRIPTION",
                  text: "비고",
                  type: "Input",
                  options: { width: "10rem", textAlign: "Left" },
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
