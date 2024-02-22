import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { EventLabel } from "../../types";
import { generateId } from "../../utils/generateId";
import BaseModal from "./BaseModal";
import styled from "styled-components";
import ColorPicker from "../ColorPicker";
import { COLORS } from "../../constants/colors";
import {
  addLabel,
  deleteLabel,
  editLabel,
} from "../../redux/features/calendar/slice";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  label?: EventLabel | null;
};

const LabelModal: React.FC<Props> = ({ isOpen, closeModal, label }) => {
  const [name, setName] = useState(label?.name || "");
  const [color, setColor] = useState(label?.color || COLORS[0]);

  useEffect(() => {
    setName(label?.name || "");
    setColor(label?.color || COLORS[0]);
  }, [label]);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (label) {
      dispatch(
        editLabel({
          ...label,
          name: name.trim(),
          color: color,
        }),
      );
    } else {
      const newLabel: EventLabel = {
        id: generateId(),
        name: name.trim(),
        color: color,
      };

      dispatch(addLabel(newLabel));
    }

    setName("");
    closeModal();
  };

  return (
    <BaseModal closeModal={closeModal} isOpen={isOpen}>
      <h2>Label</h2>
      <Form onSubmit={handleSubmit}>
        <LabelSpan>
          Name:
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabelSpan>

        <ColorPicker selectedColor={color} selectColor={setColor} />

        <Flex>
          {label && (
            <Button onClick={() => dispatch(deleteLabel(label))} $danger>
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
  gap: 20px;
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

export default LabelModal;
