import { getDate } from "../utils/getDate";

export const getMonthDays = (month: number, year: number) => {
  const firstDayOfMonth = getDate(year, month, 1);

  const firstMonthDay = firstDayOfMonth.day();
  const lastMonthDay = firstDayOfMonth.endOf("month");
  const lastDay = lastMonthDay.day();

  const startOfWeek = firstDayOfMonth.subtract(firstMonthDay - 1, "day");
  const endOfWeek = lastMonthDay.add(
    lastDay === 0 ? 0 : 7 - lastMonthDay.day(),
    "day",
  );

  const result = [];
  let currentDate = startOfWeek;
  while (currentDate.isBefore(endOfWeek)) {
    result.push(currentDate.toString());
    currentDate = currentDate.add(1, "day");
  }

  return result;
};
