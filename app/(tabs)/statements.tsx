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
import {Picker} from '@react-native-picker/picker';
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

interface users {
  id: number;
  name: string;
  email: string;
  card: number;
  cardId: number;
  active: boolean;
}

const Statements: React.FC = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataCkbx, setDataCkbx] = useState<checkboxData[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCheckedGlobal, setIsCheckedGlobal] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(-1);
  const [users, setUsers] = useState<users[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const params = useLocalSearchParams<{ id?: string }>();
  let api_domain = `${process.env.EXPO_PUBLIC_DOMAIN}${process.env.EXPO_PUBLIC_API_VERSION}`;
  let api_statements_url = api_domain + `/statements`;
  let api_users_url = api_domain + `/users?allusers=1`;
  let tempMessage = "";
  let isMultipleTransactions = "";
  const userHeaders = {
    "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
    "Imc-App-Key": process.env.EXPO_PUBLIC_APP_KEY,
  };
  // console.log(process.env.EXPO_PUBLIC_DOMAIN);

  //Initialize isChecked array as falseß
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

  // Parse user object from api call and set list of users
  function ParseUsers(userObj:users[]){
    let activeUsers:users[] = [];
    userObj.map((x) => {
      if (x.active && x.cardId != null)
        activeUsers.push(x);
    })
    setUsers(activeUsers);
  }

  
  useEffect(() => {
    let isUsersAvailable = users.length == 0 ? false : true;
      
    const fetchTransactions = async () => {
      try {
        // Call api for list of active users with a valid cc#
        if (!isUsersAvailable){
          console.log("Get users")
          const response_users = await axios.get(api_users_url, {
            headers: userHeaders,
          });
          if (response_users.data.users != null) {
            isUsersAvailable = true;
            ParseUsers(response_users.data.users);
            //TODO: log this scenario
          }
          else 
            isUsersAvailable = false;
        }
        
        //Set statements URL based on if dropdown is available (is this Admin mode)
        //TODO: if admin mode, call new endpoint
        if (isUsersAvailable && selected != -1)
          api_statements_url = api_statements_url + "?id=" + selected
        else if (isUsersAvailable && selected == -1)
          api_statements_url = "";

        // Do i need this?  It will allow users to see other people's data
        // else if (!isUsersAvailable)
        //   api_statements_url = api_statements_url = params.id != null ? api_statements_url + "?id=" + params.id : api_statements_url;

        // Fetching transaction data from API
        // Call GetStatements
        // GetStatements(params);
        if (api_statements_url !== ""){
          const response = await axios.get(api_statements_url, {
            headers: userHeaders
          });
          console.log("Get Transactions")
          setIsCheckedGlobal(false);
          setData(response.data.expenses);
          InitialDataCkbx(response.data.expenses);
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [selected]);

  // Reset the following controls
  // * Status Message
  // * Report Button
  useEffect(() => {
    isMultipleTransactions = data.length > 1 ? " transactions" : " transaction";
    tempMessage = data.length > 0 ? data.length + isMultipleTransactions : "No Transactions Available";
    setStatusMessage(tempMessage);
    setIsChecked(false);
  }, [data]);

  //console.log("testing");
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

  // Global checkbox logic
  // Calls handleChange with -20 to uncheck all boxes or -10 to check all boxes
  const handleSelectAll = () => {
    isCheckedGlobal ? handleChange(-20) : handleChange(-10);
    setIsCheckedGlobal(!isCheckedGlobal);
  }

  // Handle Dropdown
  const handleDrowndownChange = (itemValue: number) => {
    setSelected(itemValue);
  }

  // Render individual transaction item
  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.itemContainer}>
      <Checkbox
        style={styles.checkboxItem} 
        value={dataCkbx[dataCkbx.findIndex(x => x.Index == item.id)].isChecked}
        onChange={() => handleChange(item.id)}
        />
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
            <View>
              <Text style={styles.header}>{statusMessage}
              <Text style={styles.buttonReport}>
                <Button 
                  title="New Report" 
                  disabled={!isChecked}/>
                </Text>
                <Picker 
                  style={styles.dropdown} 
                  selectedValue={selected} 
                  onValueChange={handleDrowndownChange}
                  // mode="dropdown"
                  >
                    <Picker.Item key="none" label="" value="-1" />
                    {users.map(user => <Picker.Item key={user.email} label={user.name} value={user.cardId}/>)}
                </Picker>
              </Text>
              {data.length > 0 && <Checkbox 
                style={styles.checkbox}
                value={isCheckedGlobal}
                onValueChange={() => handleSelectAll()}

                // color={isChecked ? '#4630EB' : undefined}
                />}
            </View>
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
    backgroundColor: "#cccff",
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
    marginLeft: 50,
  },
buttonReport: {
  width: 150,
  marginLeft: 50,
},
checkbox: {
  marginLeft: 10,
},
checkboxItem: {
  marginLeft: -20,
},
dropdown: {
  marginLeft: 50,
},
status: {
  marginLeft: 30,
  color: "red"
}
});

export default Statements;
