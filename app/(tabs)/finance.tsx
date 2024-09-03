import React, { useState } from "react";
import Papa from "papaparse";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const fileReader = new FileReader();

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files != null) setFile(e.target.files[0]);
  };

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target != null ? event.target.result : null;
        if (csvOutput) {
          const parsedData = Papa.parse(csvOutput.toString(), {
            header: true,
            skipEmptyLines: true,
          });
          if (parsedData.errors.length > 0) {
            console.error("Error parsing CSV:", parsedData.errors);
          } else {
            console.log(parsedData.data);
          }
        } else {
          console.error("Failed to read file data");
        }
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
    </div>
  );
}
