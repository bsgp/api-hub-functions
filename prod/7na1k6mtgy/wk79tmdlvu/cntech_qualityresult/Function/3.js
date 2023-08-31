module.exports = async (draft, { request }) => {
  const { method, reqBody } = request;
  const isTest = false;
  const tennant = isTest ? "my348037" : "my349266";
  const url = `https://${tennant}.sapbydesign.com`;
  const id = "admin";
  const password = isTest ? "Welcome123" : "Welcome1";
  draft.json.isTest = isTest;
  draft.json.tennant = tennant;
  draft.json.url = url;
  draft.json.id = id;
  draft.json.password = password;
  draft.response.body = { result: "test", method, reqBody, isTest };
};
