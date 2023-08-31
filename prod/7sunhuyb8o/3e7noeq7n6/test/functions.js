module.exports.addWeekdays = (dayjs, date, days = 1, format = "YYYY-MM-DD") => {
  date = dayjs(date);
  while (days > 0) {
    date = date.add(1, "day");
    if (dayjs(date).day() !== 0 && dayjs(date).day() !== 6) {
      days -= 1;
    }
  }
  while (days < 0) {
    date = date.subtract(1, "day");
    if (dayjs(date).day() !== 0 && dayjs(date).day() !== 6) {
      days += 1;
    }
  }
  return date.format(format);
};
