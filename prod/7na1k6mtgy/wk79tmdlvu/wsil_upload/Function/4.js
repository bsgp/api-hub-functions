module.exports = async (draft, { odata, file, log }) => {
  // your script
  const { systemID, id, password } = draft.json;
  const wsilURL = `https://${systemID}.sapbydesign.com/sap/ap/srt/wsil`;

  try {
    const wsdlXML = await odata.get({ url: wsilURL, username: id, password });
    let xml2Json;
    const parseString = require("xml2js").parseString;
    await parseString(wsdlXML, function (err, result) {
      if (err) {
        log(err);
      }
      xml2Json = result;
    });

    const services = xml2Json["wsil:inspection"]["wsil:service"];
    const convService = services.map((item) => ({
      abstract: item["wsil:abstract"][0],
      name: item["wsil:name"][0],
      location: item["wsil:description"][0]["$"]["location"],
    }));

    const getName = (txt) => [`/bydesign/wsil`, txt].join("/");
    await file.upload(getName(`${systemID}_backup.xml`), wsdlXML, {
      gzip: true,
    });
    await file.upload(getName(`${systemID}_backup.json`), convService, {
      gzip: true,
    });
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "saved successfully",
      uploadFilePath: getName(),
      convService: {
        count: convService.length,
        data: convService,
      },
    };
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
};
