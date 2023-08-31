module.exports = async (draft, { request }) => {
  draft.response.body.version = request.qualifier;

  draft.response.body.SystemInfo = draft.json.SystemInfo.body.result;
  draft.response.body.SystemInfo.FieldDescriptor =
    draft.json.SystemInfoFieldDescriptor.body.result;

  draft.response.body.SystemParameters =
    draft.json.SystemParameters.body.result;
  draft.response.body.SystemParameters.FieldDescriptor =
    draft.json.SystemParametersFieldDescriptor.body.result;
};
