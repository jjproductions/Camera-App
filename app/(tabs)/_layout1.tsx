import { Tabs, Stack, Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  let isAdmin = localStorage.getItem("isAdmin") == 'true' ? true : false;;
  let isSignedIn = localStorage.getItem("jwtToken") == "" ? false : true;;

  // useEffect(() =>{
  //   // setIsSignedIn(localStorage.getItem("jwtToken") == "" ? false : true);
  //   isAdmin = localStorage.getItem("isAdmin") == 'true' ? true : false;
  //   isSignedIn = localStorage.getItem("jwtToken") == "" ? false : true;
  //   console.log(`layout :: setting isAuth:${localStorage.getItem("jwtToken")} and isAdmin=${isAdmin}`);
  // }, [localStorage.getItem["jwtToken"]]);

  console.log(`layout :: setting isAuth:${isSignedIn} and isAdmin=${isAdmin}`);

  // if (!isSignedIn)
  //   return <Redirect href={"/signin"} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      {!isSignedIn ? (
        <Tabs.Screen
        name="signin"
        options={{
          title: "Login / Register",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      /> ) : (
        <>
          {isAdmin && <Tabs.Screen
            name="finance"
            options={{
              title: "Finance",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "calculator" : "calculator-outline"}
                  color={color}
                />
              ),
            }}
          />}
          <Tabs.Screen
            name="statements"
            options={{
              title: "View Statements",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="camera"
            options={{
              title: "Camera",
              tabBarButton: () => null,
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "camera" : "camera-outline"}
                  color={color}
                />
              ),
            }}
          />
      </>)}
    </Tabs>
  );
}
