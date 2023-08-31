/* eslint-disable no-param-reassign */
module.exports = async (draft, { request }) => {
  draft.response.body.message = "test1 done";
  draft.response.body.test1 = { sid: request.systemId, pid: request.partnerId };
};
