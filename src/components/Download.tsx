import React from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCalendarDownloadData } from "../redux/features/calendar/selectors";
import styled from "styled-components";

const Download: React.FC = () => {
  const calendarData = useAppSelector(selectCalendarDownloadData);

  const blobConfig = new Blob([JSON.stringify(calendarData)], {
    type: "text/json;charset=utf-8",
  });
  const blobUrl = URL.createObjectURL(blobConfig);

  return (
    <Link href={blobUrl} download="calendarData.json">
      Download
    </Link>
  );
};

const Link = styled.a`
  text-decoration: none;

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
`;

export default Download;
