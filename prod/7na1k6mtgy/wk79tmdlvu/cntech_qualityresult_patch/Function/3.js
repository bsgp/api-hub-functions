module.exports = async (draft) => {
  const isTest = false;
  const tennant = isTest ? "my348037" : "my349266";
  const username = "admin";
  const password = isTest ? "Welcome123" : "Welcome1";
  const idNpw = `${username}:${password}`;
  const authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  const hostname = `${tennant}.sapbydesign.com`;

  draft.json.authorization = authorization;
  draft.json.hostname = hostname;
  draft.response.body = {};
};
