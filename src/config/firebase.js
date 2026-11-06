
import { initializeApp, getApp, getApps } from 'firebase/app';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAchLL1F21YqsuRGinGX6D8qCyxrV1DnU0",
  authDomain: "hbplus-auth-system.firebaseapp.com",
  projectId: "hbplus-auth-system",
  storageBucket: "hbplus-auth-system.firebasestorage.app",
  messagingSenderId: "35341443851",
  appId: "1:35341443851:web:dcad01fb47227d2a55b80e",
};

// Initialize Firebase only once
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export default app;
