module.exports = async (draft, { soap, log, file }) => {
  // let wsdlAlias;
  // let certAlias;
  // if (draft.pipe.json.isTest) {
  const wsdlAlias = "test13";
  const certAlias = "test10";
  // } else {
  //   wsdlAlias = "prod7";
  //   certAlias = "prod1";
  // }
  const SalesOrderArr = draft.pipe.json.SalesOrderArr;
  draft.response.body.push({ SalesOrderArr });

  const FullPathList = draft.pipe.json.fullPathList;
  const Mpayload = { BasicMessageHeader: {}, SalesOrder: [] };

  // 파일에서 오더가 여러건인 경우 한건이라도 isComplete=false이면 오더 생성x, 파일이동 x
  const isFalsePath = [];
  for (let orderIdx = 0; orderIdx < SalesOrderArr.length; orderIdx++) {
    if (SalesOrderArr[orderIdx].isComplete === false) {
      isFalsePath.push(SalesOrderArr[orderIdx].fullPath);
    }
  }
  for (let orderIdx = 0; orderIdx < SalesOrderArr.length; orderIdx++) {
    const currFile = SalesOrderArr[orderIdx].fullPath;
    if (!isFalsePath.includes(currFile)) {
      const SalesOrder = SalesOrderArr[orderIdx].SalesOrder;
      Mpayload.SalesOrder.push(SalesOrder);
    }
  }

  let result2;
  draft.response.body.push(Mpayload);
  if (Mpayload.SalesOrder.length > 0) {
    try {
      result2 = await soap(`manage_sales_orders:${wsdlAlias}`, {
        p12ID: `lghhuktest:${certAlias}`,
        operation: "MaintainBundle",
        payload: Mpayload,
      });

      draft.response.body.push(result2);

      if (result2.statusCode === 200) {
        for (let fileIdx = 0; fileIdx < FullPathList.length; fileIdx++) {
          const currFile = FullPathList[fileIdx];
          if (!isFalsePath.includes(currFile)) {
            const fullfilepath = draft.pipe.json.fullPathList[fileIdx];
            // const fileName = fullfilepath.substr(
            //   fullfilepath.lastIndexOf("/") + 1,
            //   fullfilepath.length
            // );
            // const filePathArr = fullfilepath.split("_");
            // const fileDate = filePathArr[filePathArr.length - 1];
            // const year = fileDate.substr(0, 4);
            // const month = fileDate.substr(4, 2);
            // const date = fileDate.substr(6, 2);
            // await file.move(
            //   fullfilepath,
            // `/custom/FROM_OpenText_done/${year}/${month}/${date}/` + fileName
            //   // `/custom/FROM_OpenText_test/` + fileName
            // );
            draft.response.body.push(fullfilepath + " is Done");
          }
        }
      } else throw new Error("create salesorder failed");
    } catch (error) {
      const now = new Date().toISOString();
      const buf = Buffer.from(Mpayload.toString(), "utf8").toString();
      log(Mpayload);
      await file.upload("/soapError/" + now, buf, { gzip: true });
      draft.response.body.push(result2);
    }
  }
};
