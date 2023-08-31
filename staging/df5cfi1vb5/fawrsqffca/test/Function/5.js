module.exports = async (draft, { task }) => {
    const result = await task.addSchedule("test", "soap", "latest", "1/10 * 31 5 ? 2021");
    draft.response.body = result;
}
