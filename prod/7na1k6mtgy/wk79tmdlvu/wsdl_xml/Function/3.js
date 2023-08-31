module.exports = async (draft, { request, lib, file, log }) => {
  const parseString = require("xml2js").parseString;
  const { tryit } = lib;
  const { isFalsy } = lib.type;
  if (isFalsy(tryit(() => request.body))) {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: "Body is required" };
    draft.response.statusCode = 400;
    return;
  }
  const wsdl = request.body.wsdl;
  const fullPath = ["bydesign", "wsdl", `my341545_${wsdl}`].join("/");
  const xmlData = await file.get(fullPath, { gziped: true });
  let xmlObj;
  await parseString(xmlData, function (err, result2) {
    if (err) {
      log(err);
    }
    xmlObj = result2;
  });
  // https://stackoverflow.com/questions/23238785/how-to-generate-xsd-from-wsdl
  const targetNamespace = xmlObj["wsdl:definitions"].$.targetNamespace;
  const wsdlType = xmlObj["wsdl:definitions"]["wsdl:portType"].map((type) => ({
    id: type.$.name,
    operation: type["wsdl:operation"].map((op) => {
      return {
        ...op,
        id: op.$.name,
        input: op["wsdl:input"][0].$.message.replace(/tns:/, ""),
      };
    }),
  }));
  const xmlschemas = xmlObj["wsdl:definitions"]["wsdl:types"][0];
  const xmlschema = xmlschemas["xsd:schema"].find(
    (schema) => schema.$.targetNamespace === targetNamespace
  );
  const nodeList = xmlschema["xsd:complexType"];
  // const createNode = (arr, startNode) => {
  //   const newNode = {};
  // };

  draft.response.body = {
    wsdl,
    fullPath,
    targetNamespace,
    wsdlType,
    nodeList,
    xmlObj,
  };
};
