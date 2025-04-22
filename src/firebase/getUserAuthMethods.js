import { getAuth } from "firebase/auth";

export const getUserAuthMethods = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const authMethods = user.providerData.map((provider) => provider.providerId);
    return authMethods;
  } else {
    return [];
  }
};