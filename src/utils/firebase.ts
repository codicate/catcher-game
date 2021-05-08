import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyD1NFcagQPimIJbwDQ1xFqihYtfjvzoZPA",
  authDomain: "codicate-catcher-game.firebaseapp.com",
  projectId: "codicate-catcher-game",
  storageBucket: "codicate-catcher-game.appspot.com",
  messagingSenderId: "1054320469268",
  appId: "1:1054320469268:web:8ad27af9a67dd26d3bce01",
  measurementId: "G-XSCM9S0BJD"
});

export const firestore = getFirestore(app);


export const addCollection = async (collectionPath: string, objArr: {}[]) => {
  const batch = writeBatch(firestore);

  objArr.forEach(obj => {
    const docRef = doc(collection(firestore, collectionPath));
    batch.set(docRef, obj);
  });

  await batch.commit();
};