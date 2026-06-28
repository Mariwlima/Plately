// firebase-init.js
// Inicialização do Firebase e lógica de autenticação (email/senha + Google)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArw4Z-D3UvTseqIGwgX3hIPAvfRX51Kuo",
  authDomain: "receitas-da-semana.firebaseapp.com",
  projectId: "receitas-da-semana",
  storageBucket: "receitas-da-semana.firebasestorage.app",
  messagingSenderId: "527115299257",
  appId: "1:527115299257:web:6d1b1274aa9a2b14e26e68",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function userDataDocRef(uid) {
  return doc(db, "users", uid, "data", "mealPlanner");
}

// Expõe globalmente para o app.js usar (mantendo tudo simples, sem bundler)
window.firebaseAuth = {
  auth,
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
  signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signOut: () => signOut(auth),
  updateDisplayName: (name) => updateProfile(auth.currentUser, { displayName: name }),
  updateUserPassword: (newPassword) => updatePassword(auth.currentUser, newPassword),
  reauthenticate: (currentPassword) => {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    return reauthenticateWithCredential(auth.currentUser, credential);
  },
  deleteAccount: () => deleteUser(auth.currentUser),
};

window.firebaseData = {
  async saveUserData(uid, data) {
    await setDoc(userDataDocRef(uid), data);
  },
  async loadUserData(uid) {
    const snapshot = await getDoc(userDataDocRef(uid));
    return snapshot.exists() ? snapshot.data() : null;
  },
  async deleteUserData(uid) {
    await deleteDoc(userDataDocRef(uid));
  },
};

window.dispatchEvent(new Event("firebase-ready"));
