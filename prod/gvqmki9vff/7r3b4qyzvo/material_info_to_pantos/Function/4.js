module.exports = async (draft, { log }) => {
  const xml2js = require("xml2js");
  const builder = new xml2js.Builder();

  const mat = draft.pipe.json.material;

  if (
    mat !== undefined &&
    mat.ProcessingConditions.ReturnedQueryHitsNumberValue !== 0
  ) {
    //object에 속성 추가 테스트
    //pantos에서 속성 추가요청 20210622
    mat["senderID"] = "5065004854016";
    mat["recieverID"] = "687822338";
    mat["DocumentType"] = "b2bWM4840";
    //오브젝트 xml로 변환
    let matXml = builder.buildObject(mat);

    matXml = matXml.replace(/\\n/g, "abc").replace(/\\"/g, '"');

    // draft.response.body.push({ matXml: matXml });
    log(matXml);
    draft.pipe.json.material = matXml;
  } else {
    draft.pipe.json.material = "_Empty";
    // draft.response.body.push({ null: draft.pipe.json.material });
  }
};
