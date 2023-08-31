module.exports = async (draft, { request, env }) => {
  const params = request.body;
  const firstLetter = `${params.VENDOR}`[0];
  const VENDOR = params.VENDOR
    ? isNaN(Number(firstLetter))
      ? params.VENDOR.toUpperCase()
      : `${params.VENDOR}`.padStart(10, "0")
    : undefined;

  draft.pipe.json.PO_Params = {
    ...params,
    VENDOR,
    WITH_PO_HEADERS: "X",
    ITEMS_OPEN_FOR_RECEIPT: "X",
  };

  draft.pipe.json.connection = {
    ashost: env.RFC_ASHOST,
    client: env.RFC_CLIENT,
    user: env.RFC_USER,
    passwd: env.RFC_PASSWORD,
    lang: "en",
  };

  draft.response.body = { params };
};
