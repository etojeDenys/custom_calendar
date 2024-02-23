import React, { useState } from "react";
import { CalendarEvent } from "../types";
import styled from "styled-components";
import { useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import ModalEvent from "./modal/ModalEvent";
import LabelsContainer from "./ui/LabelsContainer";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { HOLIDAY_INDEX } from "../helpers/convertToCalendarEvents";

type Props = {
  day: string;
  events: CalendarEvent[];
};

const Cell: React.FC<Props> = ({ day, events }) => {
  const thisDay = dayjs(day);

  const selectedDate = useAppSelector((state) => state.calendar.selectedDate);

  const [isOpen, setIsOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null);

  const chooseEditedEvent = (event: CalendarEvent) => {
    if (event.index === HOLIDAY_INDEX) return;

    setEditedEvent(event);
    setIsOpen(true);
  };

  const isThisMonth = thisDay.month() === dayjs(selectedDate).month();

  return (
    <>
      <CellContainer $isDisabled={!isThisMonth}>
        <FlexContainer>
          <TextField>{thisDay.date()}</TextField>
          {isThisMonth && (
            <TextField onClick={() => setIsOpen(true)}>+</TextField>
          )}
        </FlexContainer>
        <Droppable key={day} droppableId={day}>
          {(provided) => (
            <EventContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {events.map((event) => {
                if (event.index === HOLIDAY_INDEX) {
                  return (
                    <Event key={event.date}>
                      <LabelsContainer labels={event.labels} />

                      {event.name}
                    </Event>
                  );
                }

                return (
                  <Draggable
                    key={event.id}
                    draggableId={event.id}
                    index={event.index}
                  >
                    {(provided) => (
                      <Event
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={event.date}
                        onClick={() => chooseEditedEvent(event)}
                      >
                        <LabelsContainer labels={event.labels} />

                        {event.name}
                      </Event>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </EventContainer>
          )}
        </Droppable>
      </CellContainer>

      {isOpen && (
        <ModalEvent
          date={day}
          isOpen={isOpen}
          event={editedEvent}
          closeModal={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const TextField = styled.span`
  color: #fff;
  font-weight: bold;

  cursor: pointer;
`;

const CellContainer = styled.div<{ $isDisabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 5px 10px;
  user-select: none;

  background-color: ${(p) => (p.$isDisabled ? "lightgrey" : "cornflowerblue")};
  height: 100%;
  box-sizing: border-box;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;

const Event = styled.li`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  gap: 5px;

  cursor: pointer;

  font-size: 12px;

  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EventContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;

  overflow: scroll;

  height: 100%;

  list-style: none;
  padding: 0;
  margin: 0;
`;

export default Cell;
