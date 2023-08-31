module.exports = async (draft, { file, log }) => {
  const parseString = require("xml2js").parseString;
  const fullPathList = draft.pipe.json.fullPathList;
  const GENs = [];
  for (let pathIdx = 0; pathIdx < fullPathList.length; pathIdx++) {
    try {
      let GEN;
      const txt = await file.get(fullPathList[pathIdx], { gziped: true });
      await parseString(txt, function (err, result) {
        if (err) {
          log(err);
        }
        GEN = convResult(result);
      });
      GENs.push({ ...GEN, filepath: fullPathList[pathIdx] });
    } catch (err) {
      draft.response.body.message = err.message;
    }
  }
  draft.json.GENs = GENs;
};

const convResult = (data) => {
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      if (data.length === 1) {
        return convResult(data[0]);
      } else return data.map(convResult);
    } else if (data) {
      const newObj = {};
      Object.keys(data).map((key) => (newObj[key] = convResult(data[key])));
      return newObj;
    }
  } else if (["string", "number", "boolean"].includes(typeof data)) {
    if (typeof data === "string") {
      return data.replace(/  +/g, " ");
    }
    return data;
  }
};
