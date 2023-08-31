module.exports = async (draft, { request }) => {
  if (draft.json.run === undefined) {
    draft.json.run = {
      rowCount: request.body.RowCount,
      rowSkips: request.body.RowSkips,
    };
  }
};
