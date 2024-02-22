import dayjs from "dayjs";

export const getDate = (year: number, month: number, day = 1) => {
  return dayjs(`${year}-${month + 1}-${day}`);
};
