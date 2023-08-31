module.exports = async (draft, { request, lib, file }) => {
  // request body:
  // {
  //   Data: params,
  //   Function: {
  //     UserId: id,
  //     UserText: name,
  //     SysId: "SUPPORT",
  //     Type: "S3",
  //     Name: "USER_HELP"
  //   }
  // }
  const reqBody = request.body;
  const { defined, tryit } = lib;
  const endpoint = defined(
    tryit(() => reqBody.Data.endpoint),
    ""
  )
    .replace(/^\//, "")
    .replace(/ /g, "");

  const sourcecode = defined(
    tryit(() => reqBody.Data.sourcecode),
    ""
  );

  if (!endpoint) {
    draft.response.body = {
      type: "F",
      message: "endpoint를 입력해주세요",
    };
    return;
  }

  const path = `user_help/${endpoint}.json`;

  draft.response.body = { fullPath: path, endpoint };
  await file.upload(path, sourcecode, { gzip: true });

  const result = await file.get(path, { gziped: true });
  draft.response.body = {
    ...draft.response.body,
    type: "S",
    message: ["저장되었습니다"].join("\n"),
    result,
  };
};
