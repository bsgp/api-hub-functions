module.exports = async (draft, { request, env }) => {
  const params = request.body;
  draft.pipe.json.PO_Params = {
    PURCHASEORDER: `${params.PO_NUMBER}`,
    ITEMS: "X",
    SCHEDULES: "X",
    HISTORY: "X",
    ITEM_TEXTS: "X",
    HEADER_TEXTS: "X",
  };
  if (params.VENDOR) {
    draft.pipe.json.VENDOR = params.VENDOR;
  }

  draft.pipe.json.connection = {
    ashost: env.RFC_ASHOST,
    client: env.RFC_CLIENT,
    user: env.RFC_USER,
    passwd: env.RFC_PASSWORD,
    lang: "en",
  };

  draft.response.body = { params };
};
