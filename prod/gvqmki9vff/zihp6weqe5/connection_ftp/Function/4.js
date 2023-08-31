module.exports = async (draft, { request, ftp, file }) => {
  const validate = draft.pipe.json.validate;
  if (validate !== true) {
    return;
  }
  const config = {
    host: "Liason.newavon.com",
    port: "",
    username: "byddrum",
    password: "jek8tvz1",
    protocol: "sftp",
    algorithms: {
      serverHostKey: ["ssh-dss"],
    },
  };

  const { client } = await ftp.connect(config);

  // const body = {
  //   InterfaceId: "",
  //   Function: {
  //     UserId: "",
  //     UserText: "",
  //     SysId: "BYD",
  //     Type: "FTP",
  //     Name: "SendProductionOrderToFTP",
  //   },
  //   Data: "0,CASELBPR,FERT_001,develop4,20211105,043753"
  // }

  // const value = "0,CASELBPR,FERT_001,develop4,20211105,043753";
  const value = request.body.Data;
  const bodySplit = value.split(",");
  const [, fileName, , , sendDate] = bodySplit;
  const year = sendDate.substr(0, 4);
  const month = sendDate.substr(4, 2);
  const date = sendDate.substr(6, 2);

  try {
    const remotePath = "/Distribution/bydesign";
    const fullPath = [remotePath, `${fileName}.txt`].join("/");

    const { results: filenameList } = await ftp
      .upload(client, value, fullPath)
      .then(() => {
        return ftp.list(client, remotePath);
      });

    await client.end();
    const buf = Buffer.from(`Upload: '${value}'`, "utf8").toString();
    await file.upload(
      `/HighWay/Upload/${year}/${month}/${date}/${fileName}.txt`,
      buf,
      { gzip: true }
    );
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `File upload: ${fileName}`,
      result: `File upload: ${fileName}`,
      value,
      path: fullPath,
      list: filenameList,
    };
  } catch (err) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error occurred: ${err.message}`,
      result: `Error occurred: ${err.message}`,
    };
    const buf = Buffer.from(
      `Failed Upload: '${value}', error: ${err.message}`,
      "utf8"
    ).toString();
    await file.upload(
      `/HighWay/Error/${year}/${month}/${date}/${fileName}.txt`,
      buf,
      { gzip: true }
    );
  }
};
