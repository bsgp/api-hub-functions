module.exports = async (draft, context) => {
  const { dayjs, kst } = context;

  draft.response.body = {
    key: Object.keys(context),
    kst,
    add: dayjs(kst).add(9, "hours"),
    addZero: dayjs(kst).add(0, "hours"),
    sub: dayjs(kst).add(-9, "hours"),
  };
};
