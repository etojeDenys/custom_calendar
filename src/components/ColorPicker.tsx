import React from "react";
import styled from "styled-components";
import { COLORS } from "../constants/colors";

type Props = {
  selectedColor: string;
  selectColor: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ selectedColor, selectColor }) => {
  return (
    <FlexContainer>
      {COLORS.map((color) => (
        <Circle
          key={color}
          background={color}
          isSelected={color === selectedColor}
          onClick={() => {
            if (color !== selectedColor) {
              selectColor(color);
            }
          }}
        />
      ))}
    </FlexContainer>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Circle = styled.div<{ isSelected: boolean; background: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(p) => p.background};

  ${(p) => p.isSelected && "outline: 3px solid #000"}
`;
export default ColorPicker;
