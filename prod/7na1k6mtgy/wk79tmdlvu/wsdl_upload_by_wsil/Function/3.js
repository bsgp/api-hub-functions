module.exports = async (draft, { lib, file }) => {
  const { tryit } = lib;
  // const systemID = "my341545";
  const systemID = "my361559";
  const id = "bsg";
  const password = "Welcome12";

  const fileData = await tryit(() =>
    file.get(`/bydesign/wsil/${systemID}_backup.json`, { gziped: true })
  );
  const data = JSON.parse(fileData);

  draft.json.systemID = systemID;
  draft.json.id = id;
  draft.json.password = password;
  draft.json.data = data;
  draft.response.body = { data };
};
