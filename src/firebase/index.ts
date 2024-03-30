import { CommandInteraction } from "discord.js";
import { initializeApp } from "firebase/app";
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore/lite";

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

const collectionId = "user-collection";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getUserCollection = async (): Promise<DocumentData[]> => {
  const docs = collection(db, collectionId);
  const snapshot = await getDocs(docs);
  const users = snapshot.docs.map((snap) => snap.data());
  return users;
};

export const getUser = async (interaction: CommandInteraction) => {
  const q = query(collection(db, collectionId), where("clientId", "==", interaction.user.id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

export const addUser = async (interaction: CommandInteraction, author: string) => {
  const docs = collection(db, collectionId);
  const user = await getUser(interaction);

  if (user.length <= 0) {
    await addDoc(docs, { name: author, clientId: interaction.user.id });
  } else {
    throw new Error("이미 등록된 사용자입니다.");
  }
};

export const deleteUser = async (interaction: CommandInteraction) => {
  const q = query(collection(db, collectionId), where("clientId", "==", interaction.user.id));
  const snapshot = await getDocs(q);
  const documentId = snapshot.docs.map((doc) => doc.id)[0];
  const docs = doc(db, collectionId, documentId);
  await deleteDoc(docs);
};
