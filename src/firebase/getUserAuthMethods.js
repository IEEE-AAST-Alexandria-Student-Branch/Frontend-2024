import { getAuth } from "firebase/auth";

export const getUserAuthMethods = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const authMethods = user.providerData.map((provider) => provider.providerId);
    console.log("Authentication methods:", authMethods);
    return authMethods;
  } else {
    console.log("No user is signed in.");
    return [];
  }
};