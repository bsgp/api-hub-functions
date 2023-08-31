module.exports = async (draft, { ftp, file }) => {
  const isTest = true;

  draft.pipe.json.isTest = isTest;

  let Config;

  if (isTest) {
    Config = {
      host: "sftpbizb12.tgms.gxs.com",
      port: "22",
      username: "ACD02635",
      password: "DU9RXFA6",
    };
  } else {
    Config = {
      host: "sftpbizp12.tgms.gxs.com",
      port: "22",
      username: "AET42468",
      password: "ZFQECM40",
    };
  }

  const { client } = await ftp.connect(Config);

  const remotePath = "/custom/FROM_OpenText";
  const fileNameList = await ftp.list(client, remotePath);

  const fullPathList = fileNameList.results.map((item) => {
    return [remotePath, item.name].join("/");
  });

  await ftp.copy(client, fullPathList, (buffer, { path }) => {
    try {
      if (path.includes("custom/FROM_OpenText/gen_")) {
        const mPath = path.replace(
          /custom\/FROM_OpenText\/gen_/,
          "custom/Gen_FROM_OpenText/gen_"
        );
        return file.upload(mPath, buffer, { gzip: true });
      } else {
        return file.upload(path, buffer, { gzip: true });
      }
    } catch (error) {
      return file.upload(path, buffer, { gzip: true });
    }
  });

  draft.pipe.json.fullPathList = fullPathList;
  draft.response.body = { message: "flow executed", fullPathList };
};
