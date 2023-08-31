module.exports = async (draft, { request, rfc }) => {
    const connection = undefined
    const result = await rfc.invoke("Z09CSREADCUSDATA", { I_TELF1: "010-3665-7802" }, connection);
    draft.response.body = result;
}