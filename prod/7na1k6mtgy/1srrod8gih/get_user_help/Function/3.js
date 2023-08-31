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
  const getEndpoints = defined(
    tryit(() => reqBody.Data.getEndpoints),
    false
  );
  const endpoint = defined(
    tryit(() => reqBody.Data.endpoint),
    ""
  );
  if (getEndpoints && endpoint) {
    draft.response.body = {
      type: "F",
      list: "Body에 getEndpoints와 endpoint가 모두 있습니다.",
    };
  } else if (getEndpoints) {
    const path = `user_help`;
    const files = await file.list(path, { gziped: true });
    if (files && files.length === 0) {
      draft.response.body = {
        type: "F",
        message: "저장된 도움말이 없습니다.",
        list: [],
      };
    } else
      draft.response.body = {
        type: "S",
        message: "조회가 완료되었습니다.",
        list: files.map((file) => ({
          endpoint: file.replace(/user_help\//, "").replace(/\.json/g, ""),
        })),
      };
  } else {
    const endpoint = defined(
      tryit(() => reqBody.Data.endpoint),
      ""
    )
      .replace(/^\//, "")
      .replace(/ /g, "");

    if (!endpoint) {
      draft.response.body = {
        type: "F",
        message: "endpoint를 입력해주세요",
      };
      return;
    }

    const path = `user_help/${endpoint}.json`;

    draft.response.body = { fullPath: path, endpoint };

    const fileList = await file.list(path, { gziped: true });
    const fFile = fileList.find((file) => file === path);
    if (fFile) {
      const result = await file.get(path, { gziped: true });
      draft.response.body = {
        ...draft.response.body,
        type: "S",
        message: [
          "도움말이 존재합니다.",
          "수정하시려면 수정 후",
          "저장버튼을 눌러주세요",
        ].join("\n"),
        result,
      };
    } else {
      draft.response.body = {
        ...draft.response.body,
        type: "S",
        message: [
          "도움말이 존재하지 않습니다",
          "편집기에서 HTML문서를",
          "입력해주세요",
        ].join("\n"),
        result: "",
      };
    }
  }
};
