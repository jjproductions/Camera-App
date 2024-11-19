import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useRef } from 'react';
import { api_domain } from '../../services/utility.js';
import axios from 'axios';

export default function HomeScreen() {
  const [showRegistration, setShowRegistration] = useState<boolean>(false);
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const regEmailRef = useRef<HTMLInputElement>(null);
  const regPasswordRef = useRef<HTMLInputElement>(null);
  const api_login_url = `${api_domain}/signin`;
  const api_register_url = `${api_domain}/register`;
  const [status, setStatus] = useState<string>("");

  interface login {
    email: string;
    password: string;
  }

  interface register {
    email: string;
    password: string;
  }

  const callLogin = async () =>
  {
      try {
        let makeLoginCall:boolean = true;
        const request:login = {
          email : loginEmailRef.current.value,
          password : loginPasswordRef.current.value
        }
        // Call api to login and get token
        if (request.email == null || request.email == "")
        {
          makeLoginCall = false;
          setStatus("email is not populated ");
        };
        if (request.password == null || request.password == "")
        {
          makeLoginCall = false;
          setStatus("passworrd is not populated");
        };
        if (makeLoginCall)
        {
          const response = await axios.post(api_login_url, request);
          setStatus("Login Successful");
          console.log(response.data.access_token);

          if (response.data.access_token) {
            localStorage.setItem("jwtToken", response.data.access_token);
            const curRole = response.data.role;
            console.log(`${request.email} role is ${curRole.includes("Admin")}`);

            var isAdmin = (curRole.includes("Admin")) ? true : false;
            localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
            localStorage.setItem("loggedInEmail", request.email);
        }
          //TODO: Navigate to default tab
        }
      } catch (error) {
          console.error("Error during login: ", error);
          
           setStatus("Login failed");
      }
  }

  const callRegistration = async () =>
    {
        try {
          let makeRegCall:boolean = true;
          const request:register = {
            email : regEmailRef.current.value,
            password : regPasswordRef.current.value
          }
          // Call api to login and get token
          if (request.email == null || request.email == "")
          {
            makeRegCall = false;
            setStatus("email is not populated ");
          };
          if (request.password == null || request.password == "")
          {
            makeRegCall = false;
            setStatus("passworrd is not populated");
          };
          if (makeRegCall)
          {
            const response_users = await axios.post(api_login_url, request);
            setStatus("Login Successful");
            //TODO: Navigate to default tab
          }
        } catch (error) {
            console.error("Error during login: ", error);
             setStatus("Login failed");
        }
    }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to the Institute of Music</ThemedText>
        <HelloWave />
      </ThemedView>
      {!showRegistration && (<>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Email:</ThemedText>
        <input style={styles.credentials} type='text' ref={loginEmailRef}/>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Password:</ThemedText>
        <input style={styles.credentials} type="password" ref={loginPasswordRef}/>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <input style={styles.login} type="button" value="Login" onClick={() => callLogin()} />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="link" onPress={() => {setShowRegistration(true);}}>Register</ThemedText>
      </ThemedView>
      </>)}
      {showRegistration && (<>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Email:</ThemedText>
        <input style={styles.credentials} type='text' ref={regEmailRef} />
      </ThemedView>
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">UserName:</ThemedText>
        <input style={styles.credentials} type='text' />
      </ThemedView> */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Password:</ThemedText>
        <input style={styles.credentials} type="text" />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <input style={styles.login} type="button" value="Register" ref={regPasswordRef} onClick={() => callRegistration()} />
      </ThemedView>
      </>)}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  credentials: {
    width: 150
  },
  login: {
    width: 75,
    textAlign: 'center'
  }
});
