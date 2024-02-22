import React from "react";
import Cell from "./Cell";
import dayjs from "dayjs";
import styled from "styled-components";
import { useAppSelector } from "../redux/hooks";
import { selectAllFilteredEvents } from "../redux/features/calendar/selectors";
import { getMonthDays } from "../helpers/getMonthDays";
import { EventLabel } from "../types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  selectedLabels: EventLabel[];
  query: string;
};

const CalendarTable: React.FC<Props> = ({ selectedLabels, query }) => {
  const events = useAppSelector((state) =>
    selectAllFilteredEvents(state, selectedLabels, query),
  );
  const selectedDate = useAppSelector((state) => state.calendar.selectedDate);

  const date = dayjs(selectedDate);

  const days = getMonthDays(date.month(), date.year());

  return (
    <div id="print">
      <GridContainer>
        {WEEKDAYS.map((weekday) => (
          <Weekday key={weekday}>{weekday}</Weekday>
        ))}
      </GridContainer>

      <GridContainer>
        {days.map((day) => (
          <ElementDiv key={day}>
            <Cell
              events={events
                .filter((e) => dayjs(day).isSame(dayjs(e.date)))
                .sort((a, b) => a.index - b.index)}
              day={day}
            />
          </ElementDiv>
        ))}
      </GridContainer>
    </div>
  );
};

const Weekday = styled.div`
  text-align: center;
  font-weight: 300;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const ElementDiv = styled.div`
  width: 100%;
  height: 150px;
`;

export default CalendarTable;
