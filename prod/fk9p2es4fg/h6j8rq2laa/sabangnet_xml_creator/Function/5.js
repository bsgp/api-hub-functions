module.exports = async (draft, { file }) => {
  const requestTime = draft.pipe.json.requestTime;
  const params = draft.pipe.json.params;
  const xmlObj = draft.pipe.json.xmlObj;

  const savePath = [
    `/sabangnet/${requestTime[0]}/${requestTime[1]}/${requestTime[2]}`,
    `/${params.ORD_ST_DATE}_${params.ORD_ED_DATE}.xml`,
  ].join("");

  const xml2js = require("xml2js");

  const convXML = (obj) => {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(obj);
    return xml;
  };

  // const buf = Buffer.from(xmlStr, "utf8").toString();
  await file.upload(savePath, convXML(xmlObj));

  const fileURL = await file.getUrl(savePath);

  draft.pipe.json.xml_url = fileURL;

  draft.response.body = { ...draft.response.body, savePath, fileURL };
};
