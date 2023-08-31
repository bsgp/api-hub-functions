module.exports = async (draft, { request }) => {
  if (!request.body.table) {
    draft.response.body = {
      errorMessage: "version is required",
    };
    draft.json.terminateFlow = true;
    return;
  } else {
    draft.json.tableId = request.body.table.toString().toLowerCase();
  }

  if (request.body.id !== undefined) {
    draft.json.datasetId = request.body.id.toString().toLowerCase();
  }

  if (request.body.version !== undefined) {
    draft.json.versionId = request.body.version.toString().toLowerCase();
  }

  if (request.body.action === "Terminate") {
    if (draft.json.versionId === undefined) {
      draft.response.body = {
        errorMessage: "version is required",
      };
      draft.json.terminateFlow = true;
      return;
    }
    if (draft.json.datasetId === undefined) {
      draft.response.body = {
        errorMessage: "id is required",
      };
      draft.json.terminateFlow = true;
      return;
    }
  }
};
