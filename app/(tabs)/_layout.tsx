import { Tabs, useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isAdmin = localStorage.getItem("isAdmin") == 'true' ? true : false;
  const isSignedIn = localStorage.getItem("jwtToken") == "" ? false : true;
  const myTab = createBottomTabNavigator();

//   useEffect(() => {
//     if (!isSignedIn) {
//         router.push("/signin");
//     }
//   }, [])

  return (
    
        // <myTab.Navigator>
        //     <myTab.Screen
        //         name="Home" component={}
        //     />
        // </myTab.Navigator>
    
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="signin"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statements"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "calculator" : "calculator-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );


}