/* eslint-disable no-param-reassign */
module.exports = async (draft, { request }) => {
  draft.response.body.message = "test2 done";
  draft.response.body.test2 = { sid: request.systemId, pid: request.partnerId };
};
