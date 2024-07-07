import { getAuth } from "firebase/auth";
import { app } from "./config";

const auth = getAuth(app);

const getUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

export default getUser;
