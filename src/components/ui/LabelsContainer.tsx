import React from "react";
import styled from "styled-components";
import { EventLabel } from "../../types";

type Props = {
  labels: EventLabel[];
};

const LabelsContainer: React.FC<Props> = ({ labels }) => {
  return (
    <Labels>
      {labels.map((label) => (
        <Label key={label.id} $color={label.color} />
      ))}
    </Labels>
  );
};

const Labels = styled.div`
  display: flex;
  gap: 3px;
`;

const Label = styled.div<{ $color: string }>`
  background: ${(p) => p.$color};
  height: 6px;
  width: 100%;

  font-weight: 300;

  border-radius: 5px;
`;

export default LabelsContainer;
