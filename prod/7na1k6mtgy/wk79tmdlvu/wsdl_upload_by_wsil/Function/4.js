module.exports = async (draft, { odata, log, file }) => {
  const { data, systemID, id, password } = draft.json;

  const serviceNames = await Promise.all(
    data.map(async (item) => {
      const location = item.location;

      const wsdlXML = await odata.get({
        url: location,
        username: id,
        password,
      });
      let serviceName;
      const parseString = require("xml2js").parseString;

      await parseString(wsdlXML, function (err, result) {
        if (err) {
          log(err);
        }
        serviceName = result["wsdl:definitions"]["wsdl:portType"][0]["$"].name;
      });
      await file.upload(
        `bydesign/wsdl/${systemID}_${serviceName}.wsdl`,
        wsdlXML,
        {
          gzip: true,
        }
      );
      return serviceName;
    })
  );

  await file.upload("bydesign/wsdlServiceName.js", serviceNames, {
    gzip: true,
  });

  draft.response.body = {
    // ...draft.response.body,
    E_STATUS: "S",
    E_MESSAGE: "changed successfully",
    serviceNames,
  };
};
