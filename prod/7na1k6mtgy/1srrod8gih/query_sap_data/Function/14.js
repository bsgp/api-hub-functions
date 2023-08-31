module.exports = async (draft, { file, request }) => {
  const keys = Object.keys(draft.json.body);

  const data = {
    count: keys.length,
    list: keys.map((key) => draft.json.body[key]),
  };

  const payloadString = JSON.stringify(data);
  const buf = Buffer.from(payloadString, "utf8").toString();
  await file.upload("/query_data/" + `${request.body.uuid}.json`, buf, {
    gzip: true,
  });
};
