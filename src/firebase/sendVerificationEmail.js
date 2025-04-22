import { getAuth, sendEmailVerification } from "firebase/auth";
import { app, auth } from "./config";

export default async function sendVerifyEmail(){
  await sendEmailVerification(auth.currentUser).then(() => {
  });
}
