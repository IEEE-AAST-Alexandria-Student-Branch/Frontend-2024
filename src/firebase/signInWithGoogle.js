import { auth } from "../firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  let result = null,
    error = null;

  try {
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code === "auth/popup-closed-by-user") {
      error = "The popup was closed before completing the sign-in.";
    } else if (e.code === "auth/network-request-failed") {
      error = "Network error. Please try again later.";
    } else if (e.code === "auth/cancelled-popup-request") {
      error = "Popup request was canceled.";
    } else if (e.code === "auth/operation-not-allowed") {
      error = "Google sign-in is not enabled. Please contact support.";
    } else {
      error = "An error occurred during Google sign-in. Please try again.";
      console.error(e);
    }
  }

  return { result, error };
}