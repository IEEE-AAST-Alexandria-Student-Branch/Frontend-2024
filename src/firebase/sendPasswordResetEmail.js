import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app, auth } from "./config";

export default async function sendPasswordEmail(userEmail) {
  await sendPasswordResetEmail(auth, userEmail).then(() => {
  }).catch((error) => {
    console.error("Error sending password reset email:", error);
  });
}
