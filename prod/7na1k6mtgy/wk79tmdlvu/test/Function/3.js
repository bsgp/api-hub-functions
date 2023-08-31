module.exports = async (draft, context) => {
  // your script
  draft.response.body = {};
  // async function test() {
  //   // No unhandled rejection!
  //   await Promise.reject(new Error("test"));
  // }

  // test();
  draft.response.body.result = "Hello!";
  draft.response.body.keys = Object.keys(context);
};
