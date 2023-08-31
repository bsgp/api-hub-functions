module.exports = async (draft) => {
  const { validate, pid } = draft.pipe.json;
  if (!validate) {
    return;
  }
  const alias = {
    my344504: {
      certAlias: "jmtest1",
    },
    my345603: {
      certAlias: "jmprod1",
    },
  };
  if (!alias[pid]) {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: "wrong pid" };
    draft.response.statusCode = 400;
    draft.pipe.json.validation = false;
    return;
  }

  const isTest = pid === "my344504" ? true : false;
  const certAlias = alias[pid].certAlias;
  draft.pipe.json.isTest = isTest;
  draft.pipe.json.username = "bsg";
  draft.pipe.json.password = isTest ? "Welcome11" : "Welcome1";
  draft.pipe.json.pid = pid;
  draft.pipe.json.certAlias = certAlias;
};
