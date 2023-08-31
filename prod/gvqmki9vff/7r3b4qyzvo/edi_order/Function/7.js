module.exports = async (draft, { log }) => {
    draft.response.body = [];
    draft.pipe.json.isTest = true;
}