module.exports = async (draft, { request, env }) => {
  const params = request.body;
  const BUSINESSPARTNER = params.VENDOR
    ? isNaN(Number(params.VENDOR))
      ? params.VENDOR.toUpperCase()
      : `${params.VENDOR}`.padStart(10, "0")
    : undefined;
  draft.pipe.json.VENDOR_Params = { BUSINESSPARTNER };

  draft.pipe.json.connection = {
    ashost: env.RFC_ASHOST,
    client: env.RFC_CLIENT,
    user: env.RFC_USER,
    passwd: env.RFC_PASSWORD,
    lang: "en",
  };

  draft.response.body = { params };
};
