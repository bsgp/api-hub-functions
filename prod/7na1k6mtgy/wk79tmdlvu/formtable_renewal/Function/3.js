module.exports = async (draft, { request, file }) => {
  const { path } = request.body;
  // const modifiedPath = path;
  let modifiedPath = "";

  if (path.includes("/z/")) {
    modifiedPath = path;
  } else if (!path.includes("/z/")) {
    modifiedPath = path.split("").filter((cur) => cur !== "/" && cur !== "z");
    modifiedPath.unshift("/z/");
    modifiedPath = modifiedPath.join("");
  }

  const metaDataPath = `formtable/savedFiles${modifiedPath}.json`;
  const metaInitPath = `formtable/savedFiles${modifiedPath}_init.js`;
  const metaRenderPath = `formtable/savedFiles${modifiedPath}_render.js`;

  let response_body = {
    E_STATUS: "S",
    E_MSG: "Saved",
    E_DATA: {},
    E_PATH: { metaDataPath, metaInitPath, metaRenderPath },
  };

  switch (request.method) {
    case "POST": {
      const { data, init, render } = request.body;
      const metaData = data;
      const metaInit = init;
      const metaRender = render;

      await file.upload(metaDataPath, metaData, {
        gziped: true,
        toJSON: true,
      });
      await file.upload(metaInitPath, metaInit, {
        gziped: true,
        // toJSON: true,
      });
      await file.upload(metaRenderPath, metaRender, {
        gziped: true,
        // toJSON: true,
      });

      response_body = {
        ...response_body,
        E_STATUS: "S",
        E_MESSAGE: "POST IS DONE",
      };
      break;
    }

    case "PATCH": {
      // file.list 조회를 위한 임시 메소드 지정
      response_body = await file.list("", {
        gziped: true,
        toJSON: true,
      });
      break;
    }

    case "GET": {
      try {
        const metaData = await file.get(metaDataPath, { toJSON: true });
        const metaInit = await file.get(metaInitPath);
        const metaRender = await file.get(metaRenderPath);

        response_body = {
          E_STATUS: "S",
          E_MSG: "GET IS DONE",
          E_DATA: { metaData, metaInit, metaRender },
          E_PATH: modifiedPath,
        };
      } catch (err) {
        response_body = {
          E_STATUS: "F",
          E_MSG: "GET IS FAILED",
          E_DATA: { err },
        };
      }
      break;
    }

    default: {
      response_body = "Default value is returned";
    }
  }
  draft.response.body = response_body;
};
