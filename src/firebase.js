import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyC2mlCYzg64P2kg5y5oRPUVzXUKY2cdwlE",
  authDomain: "stg-proyect.firebaseapp.com",
  projectId: "stg-proyect",
  storageBucket: "stg-proyect.firebasestorage.app",
  messagingSenderId: "404725970156",
  appId: "1:404725970156:web:342e394e1d0e372642e1c9",
  measurementId: "G-WNFG1JHYEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Variable para obtener funcinalidad de autenticacion
const auth = getAuth(app);
const Provider = new GoogleAuthProvider();

//conexion a db
const db = getFirestore(app);

//Exportar variable para consumo del proyecto
export {auth, Provider, db, signOut }