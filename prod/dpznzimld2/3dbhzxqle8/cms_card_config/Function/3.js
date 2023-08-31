module.exports = async (draft) => {
  // your script
  draft.response.body = {
    card: {
      tables: [
        {
          id: "cardList",
          title: "카드승인내역",
          mode: "MultiSelect",
          select: "onSelectRow",
          toolbars: [
            {
              id: "save",
              text: "전송",
              // properties: { icon: "sap-icon://save" },
            },
          ],
          columns: [
            // {
            //   id: "INDEX",
            //   text: "No.",
            //   options: { width: "2.5rem" },
            // },
            {
              id: "approvalNumber",
              text: "승인번호",
              type: "Link",
              properties: {},
            },
            {
              id: "approvalDate",
              text: "승인일자",
              type: "Identifier",
              options: { text: "{approvalTime}" },
            },
            {
              id: "approvalAmount",
              text: "승인금액",
              type: "Quantity",
              properties: { hAlign: "Center", width: "11rem" },
              options: { unit: "원" },
            },
            { id: "franchisee", text: "가맹점" },
            {
              id: "BYD_invoiceID",
              text: "BYD문서번호",
              type: "Link",
            },
            {
              id: "cardNumber",
              text: "카드번호",
              properties: { width: "11rem" },
            },
            {
              id: "itemDialogBtn",
              text: "",
              type: "Button",
              options: { text: "입력" },
            },
            // { id: "DESIC_INPUT", text: "승인금액", type: "input" },
          ],
          items: [],
        },
      ],
      dialogs: [],
    },
  };
};
