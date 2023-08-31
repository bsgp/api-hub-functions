module.exports.getDayUnit = (rangeFormat) => {
  switch (rangeFormat) {
    case "YYYY":
      return "years";
    case "YYYYMM":
      return "months";
    case "YYYYMMDD":
    default:
      return "days";
  }
};
