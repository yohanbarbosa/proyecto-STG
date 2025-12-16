import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth , db } from "../firebase.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("🔥 Auth email:", firebaseUser.email);

        const q = query(
          collection(db, "users"),
          where("email", "==", firebaseUser.email)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn("⚠️ No existe usuario en Firestore con ese email");
          setUser(null);
        } else {
          const firestoreUser = querySnapshot.docs[0].data();

          const mergedUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            role: firestoreUser.role,
          };

          console.log("🧩 Usuario fusionado:", mergedUser);
          setUser(mergedUser);
        }
      } catch (error) {
        console.error("❌ Error consultando Firestore:", error);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);