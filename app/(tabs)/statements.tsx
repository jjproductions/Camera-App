import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

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

const Statements: React.FC = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useLocalSearchParams<{ id?: string }>();
  let api_url = "https://localhost:44382/api/v1/statements";

  useEffect(() => {
    // Simulate fetching data from an API using the provided static data
    if (params.id != null) api_url = api_url + "?id=" + params.id;
    console.log("Calling api: " + api_url);
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(api_url, {
          headers: {
            "X-Api-Key": "1234",
            "Imc-App-Key": "asouder@instituteofmusic.org",
          },
        });
        setData(response.data.expenses); // Assuming the API response has the same structure as provided
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  //       try {
  //         // Simulate API call using static data
  //         const response = [
  //           {
  //             Id: "234",
  //             Card: "6571",
  //             "Transaction Date": "8/13/2024",
  //             "Post Date": "8/13/2024",
  //             Description: "VISTAPRINT",
  //             Category: "Professional Services",
  //             Type: "Sale",
  //             Amount: "-34.1",
  //             Memo: "",
  //             "Report Id": "35",
  //           },
  //           {
  //             Id: "132",
  //             Card: "1200",
  //             "Transaction Date": "8/9/2024",
  //             "Post Date": "8/12/2024",
  //             Description: "BRUNO PIZZERIA",
  //             Category: "Food & Drink",
  //             Type: "Sale",
  //             Amount: "-715.89",
  //             Memo: "",
  //             "Report Id": "33",
  //           },
  //         ];

  //         setData(response);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchTransactions();
  //   }, []);
  console.log(data);
  // Render individual transaction item
  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.itemContainer}>
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  itemContainer: {
    padding: 15,
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
});

export default Statements;
