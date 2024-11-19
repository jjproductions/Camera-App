
// const auth = localStorage != null ? `Bearer localStorage.getItem("jwtToken")` : "";
// export const userHeaders = {
    
//     "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
//     "Imc-App-Key": process.env.EXPO_PUBLIC_APP_KEY,
//     "Authorization": auth
//   };

export const api_domain = `${process.env.EXPO_PUBLIC_DOMAIN}${process.env.EXPO_PUBLIC_API_VERSION}`;

