module.exports = async (draft, { file }) => {
  const wsdl_total_list = await file.list("bydesign/wsdl");
  const services = wsdl_total_list
    .filter((item) => item.includes("my341545"))
    .map((item) => ({
      serviceCode: item
        .replace(/bydesign\/wsdl\//, "")
        .replace(/my341545_/, "")
        .replace(/\.wsdl/, ""),
      serviceName: "",
      serviceFile: item.replace(/bydesign\/wsdl\//, ""),
      tests: [],
    }));
  draft.response.body = { services };
};
