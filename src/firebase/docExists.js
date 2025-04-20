import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function docExists(collection, id) {
    let docRef = doc(db, collection, id);
  
    try {
      const document = await getDoc(docRef);
      return document.exists();
    } catch (e) {
      console.error("Error checking document existence:", e);
      return false;
    }
  }