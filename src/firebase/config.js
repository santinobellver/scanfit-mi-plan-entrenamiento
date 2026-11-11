import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Lectura de variables de entorno con prefijo VITE_ mediante import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verificación preventiva para orientar al desarrollador si falta configurar el archivo .env
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.apiKey.includes('tu_api_key')
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

/**
 * Garantiza que el visitante tenga una sesión activa en Firebase Authentication (Anónima).
 * Esto permite cumplir con las reglas de seguridad de Firestore (request.auth != null)
 * sin obligar al usuario a atravesar una pantalla de registro.
 */
export const ensureAnonymousSession = () => {
  return new Promise((resolve, reject) => {
    if (!isFirebaseConfigured || !auth) {
      reject(
        new Error(
          'Faltan las variables de entorno de Firebase (.env). Revisá el archivo .env.example.'
        )
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          try {
            const credential = await signInAnonymously(auth);
            resolve(credential.user);
          } catch (authError) {
            reject(authError);
          }
        }
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

export { db, auth };
