import { getFirestore, collection, getDocs, query, where, documentId } from "firebase/firestore";

const db = getFirestore();

export default async function getDocumentsByIds(collectionName, ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid input: 'ids' must be a non-empty array.");
    }

    try {
        const colRef = collection(db, collectionName);
        const q = query(colRef, where(documentId(), "in", ids));
        const querySnapshot = await getDocs(q);

        const documents = [];
        const foundIds = new Set();

        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, data: doc.data() });
            foundIds.add(doc.id);
        });

        const invalidIds = ids.filter((id) => !foundIds.has(id));

        return { documents, invalidIds };
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
}