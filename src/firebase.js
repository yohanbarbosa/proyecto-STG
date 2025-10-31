import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signOut ,GithubAuthProvider , FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Initialize Firebase|
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Variable para obtener funcinalidad de autenticacion
const auth = getAuth(app);

const GoogleProvider = new GoogleAuthProvider();
const providerGitHub = new GithubAuthProvider();
const providerFacebook = new FacebookAuthProvider();

//conexion a db
const db = getFirestore(app);

//Exportar variable para consumo del proyecto
export {auth, db, signOut, GoogleProvider , providerGitHub, providerFacebook}

