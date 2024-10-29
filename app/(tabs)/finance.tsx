import React, { memo, useState } from "react";
import { StyleSheet, Image, Platform, TextInput, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Papa from "papaparse";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InterfaceOrientation } from "react-native-reanimated";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fileReader = new FileReader();
  let api_url = `${process.env.EXPO_PUBLIC_DOMAIN}${process.env.EXPO_PUBLIC_API_VERSION}/expenses`;
  let postCallMessage = "";

  interface Expense {
    transactionDate: string;
    postDate: string;
    amount: number;
    description: string;
    cardNumber: number;
    category: string;
    type: string;
    memo: string;
  }

  interface bankExpense {
    Amount: string;
    Card: string;
    Category: string;
    Description: string;
    Memo: string;
    "Post Date": string;
    "Transaction Date": string;
    Type: string;
  }

  function prepForApiCall(sData:string){
    if (sData !== ""){
      let expenses:Expense[] = [];
      const oData:bankExpense[] = JSON.parse(sData);
      console.log(oData[1].Category);

      for (let i=0; i<oData.length;i++){
          expenses.push({
            amount : Number(oData[i].Amount),
            cardNumber : Number(oData[i].Card),
            transactionDate : new Date(oData[i]["Transaction Date"]).toJSON(),
            postDate : new Date(oData[i]["Post Date"]).toJSON(),
            category : oData[i].Category,
            description : oData[i].Description,
            type : oData[i].Type,
            memo : oData[i].Memo
          })
      }

      console.log(JSON.stringify(expenses));

      // Post data
      
      console.log(`Calling api: ${api_url}`);
      
      const postExpenses = async () => {
      try {
          const response = await axios.post(api_url, expenses, {
          headers: {
              "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
              "Imc-App-Key": process.env.EXPO_PUBLIC_APP_KEY,
          },
          });
          postCallMessage = "Data uploaded successfully!"
      } catch (error) {
          console.error("Error fetching data:", error);
          postCallMessage = "Sorry, the data failed to upload"
      } finally {
          setLoading(false);
      }
      };
      postExpenses();
    }

  }

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
          const parsedData: Papa.ParseResult<string> = Papa.parse(
            csvOutput.toString(),
            {
              header: true,
              skipEmptyLines: true,
            }
          );
          if (parsedData.errors.length > 0) {
            console.error("Error parsing CSV:", parsedData.errors);
          } else {
            prepForApiCall(JSON.stringify(parsedData.data));
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
