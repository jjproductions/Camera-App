import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import Checkbox from 'expo-checkbox';
// import GetStatements from "../../services/users.js"

// Define TypeScript interface for transaction data
interface CardInfo {
  cardNumber: number;
  active: boolean;
}

interface Expense {
  id: number;
  transactionDate: string;
  postDate: string;
  amount: number;
  description: string;
  cardNumber: number;
  category: string;
  type: string;
  created: string;
  memo: string;
  reportID: string | null;
  cardInfo: CardInfo;
}

interface Status {
  statusMessage: string | null;
  statusCode: number;
  count: number;
}

interface ApiResponse {
  status: Status;
  expenses: Expense[];
}

interface checkboxData {
  Index: number;
  isChecked: boolean;
}

const Statements: React.FC = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataCkbx, setDataCkbx] = useState<checkboxData[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCheckedGlobal, setIsCheckedGlobal] = useState<boolean>(false);
  const params = useLocalSearchParams<{ id?: string }>();
  let api_url = `${process.env.EXPO_PUBLIC_DOMAIN}${process.env.EXPO_PUBLIC_API_VERSION}/statements`;
  // console.log(process.env.EXPO_PUBLIC_DOMAIN);

  function InitialDataCkbx(idData:Expense[]){
    let tempData:checkboxData[] = [];
    for (let i=0; i<idData.length; i++)
    {
      tempData.push({
        Index : idData[i].id,
        isChecked : false,
      }
      );
    }
    setDataCkbx(tempData);
  }

  useEffect(() => {
    // Simulate fetching data from an API using the provided static data
    // Call GetStatements
    // GetStatements(params);
    if (params.id != null) api_url = api_url + "?id=" + params.id;
    // console.log(`Calling api: ${api_url}`);
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(api_url, {
          headers: {
            "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
            "Imc-App-Key": process.env.EXPO_PUBLIC_APP_KEY,
            mode: "no-cors"
          },
        });
        setData(response.data.expenses); // Assuming the API response has the same structure as provided
        InitialDataCkbx(response.data.expenses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  // Enable / Disable Generate Report Button
  function handleReport(dataReport:checkboxData[]) {
    let showReportButton = false;
    for (let i=0; i<dataReport.length; i++){
      if (dataReport[i].isChecked){
        showReportButton = true;
        break;
      }
    }
    showReportButton ? setIsChecked(true) : setIsChecked(false);
  }
  
  // Enable / Disable Transaction Selection
  // -20 => deselect all checkboxes
  // -10 => select all checkboxes
  const handleChange = (id:number) => {
    let temp = dataCkbx.map((item) => {
      if (id == -20 || id == -10){
        if (id == -20)
          return { ...item, isChecked: false}
        else
          return { ...item, isChecked: true};
      }
      else if (id === item.Index) {
        setIsCheckedGlobal(false);
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });
    console.log("handle Change")
    setDataCkbx(temp);
    handleReport(temp);
  };


  const handleSelectAll = () => {
    isCheckedGlobal ? handleChange(-20) : handleChange(-10);
    setIsCheckedGlobal(!isCheckedGlobal);
  }

  // Render individual transaction item
  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.itemContainer}>
      <Checkbox
        style={styles.checkboxItem} 
        value={dataCkbx[dataCkbx.findIndex(x => x.Index == item.id)].isChecked}
        onChange={() => handleChange(item.id)}
        />
      {/* <CheckBox 
        style={styles.checkboxItem} 
        value={dataCkbx[dataCkbx.findIndex(x => x.Index == item.id)].isChecked}
        onChange={() => handleChange(item.id)}
        /> */}
      <Text style={styles.card}>Card: {item.cardNumber}</Text>
      <Text style={styles.text}>ID: {item.id}</Text>
      <Text style={styles.text}>
        Transaction Date: {new Date(item.transactionDate).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        Post Date: {new Date(item.postDate).toLocaleString()}
      </Text>
      <Text style={styles.text}>Description: {item.description}</Text>
      <Text style={styles.text}>Category: {item.category}</Text>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.amount}>Amount: ${item.amount}</Text>
      <Text style={styles.text}>Memo: {item.memo}</Text>
      <Text style={styles.text}>Report ID: {item.reportID}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
          {data.length == 0 ? (
            <Text style={styles.header}>No transactions available</Text>
          ) : (
            <View>
              <Text style={styles.header}>{data.length} transactions
              <Text style={styles.buttonReport}>
                <Button 
                  title="New Report" 
                  disabled={!isChecked}/>
                
                </Text>
              </Text>
              <Checkbox 
                style={styles.checkbox}
                value={isCheckedGlobal}
                onValueChange={() => handleSelectAll()}
                // color={isChecked ? '#4630EB' : undefined}
                />
            </View>
          )}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            // onRefresh={()=> void;}
          />
          </>)}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  itemContainer: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  card: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
  amount: {
    fontSize: 14,
    marginTop: 5,
    color: "red",
  },
  header: {
    fontSize : 20,
    margin: 5,
  },
buttonReport: {
  width: 150,
  marginLeft: 300,
},
checkbox: {
  marginLeft: 10,
},
checkboxItem: {
  marginLeft: -20,
}
});

export default Statements;
