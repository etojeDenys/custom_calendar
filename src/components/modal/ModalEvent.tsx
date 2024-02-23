import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addEvent,
  deleteEvent,
  editEvent,
} from "../../redux/features/calendar/slice";
import { CalendarEvent, EventLabel } from "../../types";
import { generateId } from "../../utils/generateId";
import BaseModal from "./BaseModal";
import styled from "styled-components";
import LabelsSelect from "../LabelsSelect";
import LabelsContainer from "../ui/LabelsContainer";
import {
  selectIndexForNewEvent,
  selectLabelsForEvent,
} from "../../redux/features/calendar/selectors";

type Props = {
  date: string;
  isOpen: boolean;
  closeModal: () => void;
  event: CalendarEvent | null;
};

const ModalEvent: React.FC<Props> = ({ date, isOpen, closeModal, event }) => {
  const labels = useAppSelector(selectLabelsForEvent);
  const newIndex = useAppSelector((state) =>
    selectIndexForNewEvent(state, date),
  );

  const [selectedLabels, setSelectedLabels] = useState<EventLabel[]>(
    event?.labels || [],
  );

  const [name, setName] = useState(event?.name || "");

  useEffect(() => {
    setName(event?.name || "");
    setSelectedLabels(event?.labels || []);
  }, [event]);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (event) {
      dispatch(
        editEvent({
          ...event,
          name: name.trim(),
          labels: selectedLabels,
        }),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: generateId(),
        date,
        name: name.trim(),
        labels: selectedLabels,
        index: newIndex,
      };

      dispatch(addEvent(newEvent));
    }

    setName("");
    setSelectedLabels([]);
    closeModal();
  };

  const handleLabelClick = (label: EventLabel) => {
    setSelectedLabels((labels) => {
      if (labels.some((l) => l.id === label.id)) {
        return labels.filter((l) => l.id !== label.id);
      }

      return [...labels, label];
    });
  };

  return (
    <BaseModal closeModal={closeModal} isOpen={isOpen}>
      <h2>Event</h2>
      <Form onSubmit={handleSubmit}>
        <LabelSpan>
          Name:
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabelSpan>

        <LabelsContainer labels={selectedLabels} />
        <LabelsSelect
          label="Choose Labels"
          options={labels}
          selectedOptions={selectedLabels}
          onLabelClick={handleLabelClick}
        />

        <Flex>
          {event && (
            <Button $danger onClick={() => dispatch(deleteEvent(event))}>
              Delete
            </Button>
          )}
          <Button>Save</Button>
        </Flex>
      </Form>
    </BaseModal>
  );
};

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
  font-size: 18px;
`;

const LabelSpan = styled.label`
  font-size: 14px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 15px;
`;

const Button = styled.button<{ $danger?: boolean }>`
  padding: 5px 15px;
  border-radius: 5px;
  background: #fff;

  cursor: pointer;

  ${(p) =>
    p.$danger
      ? `
  border: 1px solid red;
  color: red; 
  
  &:hover {
    color: #fff;
    background: red;
  }
  `
      : `
  border: 1px solid cornflowerblue;
  color: cornflowerblue;
  
   &:hover {
    color: #fff;
    background: cornflowerblue;
  }
  `}
`;

const Flex = styled.div`
  display: flex;
  justify-content: end;
  gap: 15px;
`;

export default ModalEvent;
