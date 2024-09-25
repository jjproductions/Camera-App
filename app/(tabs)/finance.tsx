import React, { useState } from "react";
import { StyleSheet, Image, Platform, TextInput, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Papa from "papaparse";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [statementData, setStatementData] = useState<String[] | null>([]);
  const fileReader = new FileReader();

  console.log(statementData);

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
          const parsedData: Papa.ParseResult<String> = Papa.parse(
            csvOutput.toString(),
            {
              header: true,
              skipEmptyLines: true,
            }
          );
          if (parsedData.errors.length > 0) {
            console.error("Error parsing CSV:", parsedData.errors);
          } else {
            setStatementData(parsedData.data);
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Finance</ThemedText>
      </ThemedView>
      <ThemedText type="defaultSemiBold">Import Statements</ThemedText>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
