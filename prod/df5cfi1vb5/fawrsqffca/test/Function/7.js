module.exports = async (draft, { ftp, file }) => {
  const config = {
    host: 'sftpbizb12.tgms.gxs.com',
    port: '22',
    username: 'ACD02635',
    password: 'DU9RXFA6',
  };
const {client} = await ftp.connect(config);

const remotePath = '/custom/FROM_OpenText';
const {results: fileNameList} = await ftp.list(client, remotePath);

const fullPathList = fileNameList.map(item => {
    return [remotePath, item.name].join("/");
})

const {results: resultList} = await ftp.copy(client, fullPathList, (buffer, {path}) => {
    return file.upload(path, buffer, {gzip:true})
});

draft.response.body = resultList;
}
