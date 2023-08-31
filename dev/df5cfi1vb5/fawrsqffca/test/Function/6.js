module.exports = async (draft, { ftp, file }) => {
    const config = {
      host: 'sftpbizb12.tgms.gxs.com',
      port: '22',
      username: 'ACD02635',
      password: 'DU9RXFA6',
    };
	await ftp.connect(config);
	
	const remotePath = '/custom/FROM_OpenText';
	const fileNameList = await ftp.list(remotePath);

	const fullPathList = fileNameList.data.map(item => {
	    return [remotePath, item.name].join("/");
	})
	
	const resultList = await ftp.copy(fullPathList, (buffer, {path}) => {
	    return file.upload(path, buffer, {gzip:true})
	});
	
	draft.response.body = resultList;
}
