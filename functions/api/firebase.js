/**
 * rorraxy Ecosystem - Master Authentication, Security & Real-time Firestore Integration
 * Supports Roles, Multi-pricing, Real-time Chat & Live Sync.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, where, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDokhLgGoe4Ib7oxUJ8zczLFWj0YJKk57Y",
  authDomain: "rorraxy-fcb91.firebaseapp.com",
  databaseURL: "https://rorraxy-fcb91-default-rtdb.firebaseio.com",
  projectId: "rorraxy-fcb91",
  storageBucket: "rorraxy-fcb91.firebasestorage.app",
  messagingSenderId: "880891394208",
  appId: "1:880891394208:web:3bd8ccacf68ad5d53af1c5",
  measurementId: "G-0XTRV9TPM3"
};

// ডুপ্লিকেট অ্যাপ ইনিশিয়ালাইজেশন এড়ানোর জন্য নিশ্চিত চেক
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ১. ডেটা সেভ করার ইউনিভার্সাল ফাংশন
export async function saveFormDataToFirestore(collectionName, formData) {
  try {
    const dataWithTimestamp = {
      ...formData,
      submittedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ২. রিয়েল-টাইম লাইভ লিসেনার
export function subscribeToRealtimeCollection(collectionName, callback, conditionField = null, conditionValue = null) {
  let q = collection(db, collectionName);
  if (conditionField && conditionValue) {
    q = query(collection(db, collectionName), where(conditionField, "==", conditionValue));
  }
  return onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  }, (error) => {
    console.error("রিয়েল-টাইম সিঙ্ক ত্রুটি:", error);
  });
}

// গ্লোবাল উইন্ডো বাইন্ডিং
window.saveFormDataToFirestore = saveFormDataToFirestore;
window.subscribeToRealtimeCollection = subscribeToRealtimeCollection;
