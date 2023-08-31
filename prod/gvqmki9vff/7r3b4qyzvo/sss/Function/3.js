module.exports = async (draft, { file }) => {
	await file.upload("copy/test", "ff");
	
}
