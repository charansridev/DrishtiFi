import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBccJcnNd2mpoNMSL1vcaRBLVjuyp9eoME",
  authDomain: "studio-8887708165-3d33a.firebaseapp.com",
  projectId: "studio-8887708165-3d33a",
  storageBucket: "studio-8887708165-3d33a.firebasestorage.app",
  messagingSenderId: "821908583746",
  appId: "1:821908583746:web:ceb925f4baa5a6b57784db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export Firebase auth functions and types for use in the app
export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    firebaseSignOut as signOut,
    onAuthStateChanged,
};
export type { User };