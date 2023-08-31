module.exports = async (draft, { request, log, file }) => {
// 	log(request.body);
// 	draft.response.body = request.body+'hi';
	
	let nowt = new Date().getTime();
	nowt += 9 * 60 * 60 * 1000;
	nowt = new Date(nowt).toISOString();

	const buf = Buffer.from(nowt+request.body, 'utf8').toString();
    file.upload('/timeTest/time.txt', buf, {gzip:true});
}
