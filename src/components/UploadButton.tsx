import React from "react";
import Button from "./ui/Button";
import { useAppDispatch } from "../redux/hooks";
import { loadData } from "../redux/features/calendar/slice";

const UploadButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <label>
        <Button>Upload</Button>

        <input
          hidden
          type="file"
          accept=".json"
          onChange={(e) => {
            const fileReader = new FileReader();
            fileReader.readAsText(e.target?.files![0], "UTF-8");
            fileReader.onload = (e) => {
              if (e.target?.result) {
                dispatch(loadData(JSON.parse(e.target.result as string)));
              }
            };
          }}
        />
      </label>
    </>
  );
};

export default UploadButton;
