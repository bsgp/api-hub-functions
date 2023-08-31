module.exports = async (draft, { odata, file }) => {
  const parseString = require("xml2js").parseString;
  const resBody = draft.response.body;
  const fileURL = resBody.fileURL.replace(/&/g, "%26");
  const url = [
    `https://r.sabangnet.co.kr/RTL_API/xml_order_info.html`,
    `xml_url=${fileURL}`,
  ].join("?");

  const sabangnetReq = await odata.get({ url }).then((res) =>
    res
      .replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/, "")
      .replace(/&lt;!\[CDATA\[/g, "")
      .replace(/]]&gt;/g, "")
      // .replace(/<!\[CDATA|]>/, "")
      .replace(/\\t|\\n|\s/g, "")
  );
  await file.upload("test/sabangnetXML.xml", sabangnetReq);

  // const uploadFile = await file.get("test/sabangnetXML.xml");
  let convXML2JS;

  await parseString(sabangnetReq, async function (err, result2) {
    if (err) {
      await file.upload("test/cXMLerror.js", JSON.stringify(err.message), {
        gzip: true,
      });
    }
    convXML2JS = result2;
  });

  // const buf = Buffer.from(convXML2JS, "utf8").toString();
  // await file.upload("test/sabangnet.js", buf, { gzip: true });

  draft.response.body = {
    creator: resBody,
    url,
    // uploadFile,
    convXML2JS: { ...convXML2JS },
  };
};
