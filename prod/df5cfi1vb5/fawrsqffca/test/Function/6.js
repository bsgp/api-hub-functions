module.exports = async (draft, { ftp }) => {
	const config = {
      host: 'sftpbizb12.tgms.gxs.com',
      port: '22',
      username: 'ACD02635',
      password: 'DU9RXFA6',
    };
    const {client} = await ftp.connect(config);
    
    const xml = '<?xm'

    const remotePath = "/custom/TO_OpenText";
    const fullPath = [remotePath,"file.xml"].join("/");
    const {results: filenameList} = await ftp.upload(client, xml, fullPath).then(()=>{
      return ftp.list(client, remotePath)
    });

    draft.response.body = {path:fullPath, list:filenameList}
}
