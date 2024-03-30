import { initializeApp } from "firebase/app";
import { DocumentData, collection, getDocs, getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "daily-commit-bot",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getUserCollection = async (): Promise<DocumentData[]> => {
  const docs = collection(db, "user-collection");
  const snapshot = await getDocs(docs);
  const users = snapshot.docs.map((snap) => snap.data());
  return users;
};
