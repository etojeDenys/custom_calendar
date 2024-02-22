import { CalendarEvent, EventLabel } from "../../../types";
import dayjs from "dayjs";
import { FIXED_LABELS } from "../../../constants/fixedLabels";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUniqueObj } from "../../../helpers/addUniqueObj";
import { fetchNationalHolidays } from "./thunks";

export type CalendarState = {
  events: CalendarEvent[];
  holidayEvents: CalendarEvent[];
  labels: EventLabel[];

  selectedDate: string;
  isHolidaysLoading: boolean;
};

const today = dayjs();

const initialState: CalendarState = {
  selectedDate: today.toString(),

  events: [],
  holidayEvents: [],
  labels: FIXED_LABELS,

  isHolidaysLoading: false,
};

export const slice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    loadData: (
      state,
      action: PayloadAction<
        Pick<CalendarState, "events" | "labels" | "holidayEvents">
      >,
    ) => {
      const data = action.payload;

      if (data?.events) {
        data.events.forEach((event) => addUniqueObj(state.events, event, "id"));
      }

      if (data?.holidayEvents) {
        data.holidayEvents.forEach((event) =>
          addUniqueObj(state.holidayEvents, event, "date"),
        );
      }

      if (data?.labels) {
        data.labels.forEach((label) => addUniqueObj(state.labels, label, "id"));
      }
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    editEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events = state.events.map((event) =>
        action.payload.id === event.id ? action.payload : event,
      );
    },
    nextMonth: (state) => {
      const date = dayjs(state.selectedDate);

      state.selectedDate = date.add(1, "month").toString();
    },
    prevMonth: (state) => {
      const date = dayjs(state.selectedDate);

      state.selectedDate = date.subtract(1, "month").toString();
    },
    selectTodayDate: (state) => {
      state.selectedDate = today.toString();
    },
    addLabel: (state, action: PayloadAction<EventLabel>) => {
      state.labels.push(action.payload);
    },
    editLabel: (state, action: PayloadAction<EventLabel>) => {
      state.labels = state.labels.map((label) =>
        action.payload.id === label.id ? action.payload : label,
      );
    },
    deleteEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events = state.events.filter(
        (event) => action.payload.id !== event.id,
      );
    },
    deleteLabel: (state, action: PayloadAction<EventLabel>) => {
      state.labels = state.labels.filter(
        (label) => action.payload.id !== label.id,
      );
      state.events = state.events.map((event) => ({
        ...event,
        labels: event.labels.filter((lbl) => lbl.id !== action.payload.id),
      }));
    },
    changeEventIndex: (
      state,
      action: PayloadAction<{
        oldIndex: number;
        newIndex: number;
        day: string;
        elementId: string;
      }>,
    ) => {
      const { oldIndex, newIndex, day, elementId } = action.payload;

      const element = state.events.find((event) => event.id === elementId);

      if (!element) return;

      const sameColEvents = state.events
        .filter((e) => e.date === day)
        .sort((a, b) => a.index - b.index);

      const newList = sameColEvents.filter(
        (_: any, idx: number) => idx !== oldIndex,
      );

      newList.splice(newIndex, 0, element);

      const finalList = newList.map((el, index) => ({
        ...el,
        index: index,
      }));

      state.events = state.events.map(
        (el) => finalList.find((e) => e.id === el.id) || el,
      );
    },
    changeEventDate: (
      state,
      action: PayloadAction<{
        oldIndex: number;
        oldDate: string;
        newIndex: number;
        newDate: string;
        elementId: string;
      }>,
    ) => {
      const { oldDate, oldIndex, newDate, newIndex } = action.payload;

      const startColEvents = state.events
        .filter((e) => e.date === oldDate)
        .sort((a, b) => a.index - b.index);

      const newStartList = startColEvents
        .filter((_: any, idx: number) => idx !== oldIndex)
        .map((el, index) => ({ ...el, index: index + 1 }));

      const element = state.events.find(
        (event) => event.id === action.payload.elementId,
      );

      if (!element) return;

      const endColEvents = state.events
        .filter((e) => e.date === newDate)
        .sort((a, b) => a.index - b.index);

      element.date = newDate;
      endColEvents.splice(newIndex, 0, element);

      const newEndList = endColEvents.map((el, index) => ({
        ...el,
        index: index,
      }));

      state.events = state.events.map((el) => {
        const newEl = newEndList.find((e) => e.id === el.id);
        if (newEl) return newEl;

        const oldEl = newStartList.find((e) => e.id === el.id);
        if (oldEl) return oldEl;

        return el;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNationalHolidays.fulfilled, (state, action) => {
      action.payload.forEach((item) =>
        addUniqueObj(state.holidayEvents, item, "date"),
      );
      state.isHolidaysLoading = false;
    });
    builder.addCase(fetchNationalHolidays.pending, (state) => {
      state.isHolidaysLoading = true;
    });
    builder.addCase(fetchNationalHolidays.rejected, (state) => {
      state.isHolidaysLoading = false;
    });
  },
});

export const {
  changeEventDate,
  changeEventIndex,
  loadData,
  deleteLabel,
  deleteEvent,
  editLabel,
  addLabel,
  editEvent,
  addEvent,
  nextMonth,
  prevMonth,
  selectTodayDate,
} = slice.actions;

export default slice.reducer;
