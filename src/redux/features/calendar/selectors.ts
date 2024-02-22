import { createSelector } from "@reduxjs/toolkit";
import { EventLabel } from "../../../types";
import { RootState } from "../../store";
import { FIXED_LABELS } from "../../../constants/fixedLabels";

const selectCalendar = (state: RootState) => state.calendar;
export const selectAllEvents = createSelector(selectCalendar, (state) => [
  ...state.events,
  ...state.holidayEvents,
]);
export const selectAllFilteredEvents = createSelector(
  [
    selectAllEvents,
    (state: RootState, labels: EventLabel[]) => labels,
    (state: RootState, labels: EventLabel[], query: string) => query,
  ],
  (events, labels, query) =>
    events
      .filter((event) => {
        if (!labels.length) return true;

        return event.labels.some((lbl) => labels.some((l) => l.id === lbl.id));
      })
      .filter((event) =>
        event.name.toLowerCase().includes(query.toLowerCase().trim()),
      ),
);

export const selectCalendarDownloadData = createSelector(
  selectCalendar,
  (state) => ({
    events: state.events,
    holidayEvents: state.holidayEvents,
    labels: state.labels,
  }),
);

export const selectLabelsForEvent = createSelector(selectCalendar, (state) =>
  state.labels.filter((lbl) => !FIXED_LABELS.some((l) => l.id === lbl.id)),
);
