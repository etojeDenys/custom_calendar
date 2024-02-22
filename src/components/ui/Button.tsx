import styled from "styled-components";

const Button = styled.div<{ $isSelected?: boolean }>`
  padding: 10px 15px;
  border: 1px solid cornflowerblue;
  border-radius: 5px;

  color: cornflowerblue;
  background: #fff;

  cursor: pointer;

  &:hover {
    color: #fff;
    background: cornflowerblue;
  }

  ${(p) =>
    p.$isSelected &&
    `
    color: #fff;
    background: cornflowerblue;
  `}
`;

export default Button;
