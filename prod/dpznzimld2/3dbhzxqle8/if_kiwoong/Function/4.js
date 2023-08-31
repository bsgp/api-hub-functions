module.exports = async (draft) => {
  draft.json.nextNodeKey = "Function#3";
};

/*
module.exports = async (draft, { env }) => {
  const { CHANNEL, CORP_BIZ_NO, KW_TOKEN, KW_URL, CARD_DATA_ENDPOINT } = env;
  draft.json.KW_URL = KW_URL;
  draft.json.CARD_DATA_ENDPOINT = CARD_DATA_ENDPOINT;
  draft.json.URL = [KW_URL, CARD_DATA_ENDPOINT].join("/");
  draft.json.CHANNEL = CHANNEL;
  draft.json.CORP_BIZ_NO = CORP_BIZ_NO;
  draft.json.KW_TOKEN = KW_TOKEN;
};
*/
