import { CalendarEvent } from "../types";
import { generateId } from "../utils/generateId";
import { HOLIDAY_LABEL } from "../constants/fixedLabels";

export const HOLIDAY_INDEX = -1;
export const convertToCalendarEvents = (arr: any[]): CalendarEvent[] => {
  return arr.map((item) => ({
    name: item.name,
    date: item.date,
    labels: [HOLIDAY_LABEL],
    id: generateId(),
    index: HOLIDAY_INDEX,
  }));
};
