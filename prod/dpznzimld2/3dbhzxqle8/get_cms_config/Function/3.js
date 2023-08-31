module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "S",
    configData: {
      import: [
        { key: "WEBCASH", text: "웹캐시" },
        { key: "KFTC", text: "금융결재원" },
      ],
      export: [{ key: "BYD", text: "ByDesign" }],
      cardAuthorization: "all",
    },
  };
};
