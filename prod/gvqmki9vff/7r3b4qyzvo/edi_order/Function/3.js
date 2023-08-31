module.exports = async (draft, { ftp, request, file, odata }) => {
  const isTest = false;
  
  draft.pipe.json.isTest = isTest;
  draft.response.body = [];

  let Config;
  
   if(isTest){
      Config = {
        host: 'sftpbizb12.tgms.gxs.com',
        port: '22',
        username: 'ACD02635',
        password: 'DU9RXFA6',
      };
  }else{
      Config = {
        host: 'sftpbizp12.tgms.gxs.com',
        port: '22',
        username: 'AET42468',
        password: 'ZFQECM40',
      };
  }
    
    const {client} = await ftp.connect(Config);

    const remotePath = '/custom/FROM_OpenText';
    const fileNameList = await ftp.list(client, remotePath);
    
    const fullPathList = fileNameList.results.map(item => {
        return [remotePath, item.name].join("/");
    })
    
    const resultList = await ftp.copy(client, fullPathList, (buffer, {path}) => {
        return file.upload(path, buffer, {gzip:true})
    });
    
    draft.pipe.json.fullPathList = fullPathList;

}