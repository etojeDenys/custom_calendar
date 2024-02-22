import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EventLabel } from "../types";
import LabelModal from "./modal/LabelModal";
import editIcon from "../icons/Edit.svg";
import checkIcon from "../icons/Check.svg";
import { FIXED_LABELS } from "../constants/fixedLabels";

type Props = {
  label: string;
  options: EventLabel[];
  selectedOptions: EventLabel[];
  onLabelClick: (label: EventLabel) => void;
};

const LabelsSelect: React.FC<Props> = ({
  label,
  options,
  selectedOptions,
  onLabelClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [editedLabel, setEditedLabel] = useState<EventLabel | null>(null);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedLabel(null);
  };

  const handleEditClick = (lbl: EventLabel) => {
    if (FIXED_LABELS.every((l) => l.id !== lbl.id)) {
      setEditedLabel(lbl);
      setIsOpenModal(true);
    }
  };

  return (
    <>
      <SelectButton ref={ref}>
        <TextFieldButton onClick={() => setIsOpen(!isOpen)}>
          {label}
        </TextFieldButton>
        {isOpen && (
          <DropdownContainer>
            {options.map((opt) => {
              const isSelected = selectedOptions.some((l) => l.id === opt.id);
              return (
                <DropdownElement
                  isSelected={isSelected}
                  onClick={() => onLabelClick(opt)}
                  key={opt.id}
                >
                  <FlexContainer>
                    <ColorCircle background={opt.color}>
                      {isSelected && <img src={checkIcon} alt="check" />}
                    </ColorCircle>
                    <TextField>{opt.name}</TextField>
                  </FlexContainer>

                  <img
                    hidden={FIXED_LABELS.some((l) => l.id === opt.id)}
                    src={editIcon}
                    width={20}
                    height={20}
                    alt="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(opt);
                    }}
                  />
                </DropdownElement>
              );
            })}

            <LastDropdownElement onClick={() => setIsOpenModal(true)}>
              <span>+</span>
              Add new label
            </LastDropdownElement>
          </DropdownContainer>
        )}
      </SelectButton>
      <LabelModal
        isOpen={isOpenModal}
        closeModal={closeModal}
        label={editedLabel}
      />
    </>
  );
};

const DropdownElement = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  border-bottom: 1px solid blue;
  cursor: pointer;
  padding: 10px 15px;

  ${(p) => p.isSelected && `background-color: lightblue`}
`;

const LastDropdownElement = styled(DropdownElement)`
  border-bottom: none;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow: scroll;

  display: flex;
  flex-direction: column;

  padding: 10px 0;
  border: 1px solid blue;
  border-radius: 5px;
  background: cornflowerblue;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  cursor: pointer;
`;

const ColorCircle = styled.div<{ background: string }>`
  box-sizing: border-box;

  width: 25px;
  height: 25px;
  padding: 4px;
  border-radius: 50%;
  background: ${(p) => p.background};
`;

const SelectButton = styled.div`
  border-radius: 10px;
  border: 1px solid cornflowerblue;
  background: cornflowerblue;
  position: relative;

  display: flex;
  justify-content: center;

  color: #fff;
  font-weight: bold;

  cursor: pointer;
  min-width: 200px;
`;

const TextField = styled.p`
  padding: 0;
  margin: 0;
`;

const TextFieldButton = styled(TextField)`
  flex: 1;
  padding: 10px 30px;

  text-align: center;
`;

export default LabelsSelect;
