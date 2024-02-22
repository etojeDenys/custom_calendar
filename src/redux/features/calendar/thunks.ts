import { createAsyncThunk } from "@reduxjs/toolkit";
import { CalendarEvent } from "../../../types";
import axios from "axios";
import { convertToCalendarEvents } from "../../../helpers/convertToCalendarEvents";
import { CalendarState } from "./slice";

type FetchNationalHolidaysParam = { countryCode: string; year: number };

export const fetchNationalHolidays = createAsyncThunk<
  CalendarEvent[],
  FetchNationalHolidaysParam,
  { state: { calendar: CalendarState } }
>("calendar/fetchHolidays", async ({ countryCode, year }, thunkAPI) => {
  const response = await axios.get(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  );
  const data = response.data;

  return convertToCalendarEvents(data);
});
