module.exports = async (draft, { request }) => {
  // your script
  // more typing check
  function toShowContent(text) {
    console.log(text);
  }

  toShowContent("hello world");
  console.log(draft, request);
};
