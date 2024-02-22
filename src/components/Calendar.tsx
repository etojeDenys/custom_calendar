import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import chevronLeftImg from "../icons/ChevronLeft.svg";
import chevronRightImg from "../icons/ChevronRight.svg";
import {
  changeEventDate,
  changeEventIndex,
  nextMonth,
  prevMonth,
  selectTodayDate,
} from "../redux/features/calendar/slice";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import LabelsSelect from "./LabelsSelect";
import { EventLabel } from "../types";
import Download from "./Download";
import Button from "./ui/Button";
import UploadButton from "./UploadButton";
import { downloadAsImage } from "../helpers/downloadAsImage";
import CalendarTable from "./CalendarTable";
import { fetchNationalHolidays } from "../redux/features/calendar/thunks";
import Loader from "./modal/Loader";

const today = dayjs();

const Calendar: React.FC = () => {
  const [selectedLabels, setSelectedLabels] = useState<EventLabel[]>([]);
  const [query, setQuery] = useState("");

  const selectedDate = useAppSelector((state) => state.calendar.selectedDate);

  const labels = useAppSelector((state) => state.calendar.labels);

  const isHolidaysLoading = useAppSelector(
    (state) => state.calendar.isHolidaysLoading,
  );

  const dispatch = useAppDispatch();

  const date = dayjs(selectedDate);

  const year = date.year();

  useEffect(() => {
    dispatch(
      fetchNationalHolidays({
        countryCode: "UA",
        year,
      }),
    );
  }, [dispatch, year]);

  const handleLabelClick = (label: EventLabel) => {
    setSelectedLabels((labels) => {
      if (labels.some((l) => l.id === label.id)) {
        return labels.filter((l) => l.id !== label.id);
      }

      return [...labels, label];
    });
  };

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (destination === undefined || destination === null) return null;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    const startDay = source.droppableId;
    const endDay = destination.droppableId;

    if (startDay === endDay) {
      dispatch(
        changeEventIndex({
          oldIndex: source.index,
          newIndex: destination.index,
          day: startDay,
          elementId: draggableId,
        }),
      );
    } else {
      dispatch(
        changeEventDate({
          oldDate: source.droppableId,
          oldIndex: source.index,
          elementId: draggableId,
          newIndex: destination.index,
          newDate: destination.droppableId,
        }),
      );
    }
  };

  return (
    <Stretch>
      <FlexContainer>
        <FlexContainer>
          <Pointer onClick={() => dispatch(prevMonth())}>
            <img width={30} src={chevronLeftImg} alt="chevron-left" />
          </Pointer>
          <Pointer onClick={() => dispatch(nextMonth())}>
            <img width={30} src={chevronRightImg} alt="chevron-right" />
          </Pointer>
          <Download />
          <UploadButton />
          <Button
            onClick={() => downloadAsImage("print", date.format("MMMM_YYYY"))}
          >
            IMG
          </Button>
        </FlexContainer>

        <h3>{date.format("MMMM YYYY")}</h3>

        <FlexContainer>
          <Input
            placeholder="Filter by name"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <LabelsSelect
            label="Filter by label"
            options={labels}
            selectedOptions={selectedLabels}
            onLabelClick={handleLabelClick}
          />
          <Button
            $isSelected={
              date.month() === today.month() && date.year() === today.year()
            }
            onClick={() => dispatch(selectTodayDate())}
          >
            Today
          </Button>
        </FlexContainer>
      </FlexContainer>

      {isHolidaysLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <CalendarTable selectedLabels={selectedLabels} query={query} />
        </DragDropContext>
      )}
    </Stretch>
  );
};

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px 15px;
  border: 1px solid cornflowerblue;
  border-radius: 5px;

  color: cornflowerblue;
  background: #fff;
`;

const Stretch = styled.div`
  height: 100%;
  padding: 5px;
`;

const Pointer = styled.div`
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  align-self: stretch;
`;

export default Calendar;
