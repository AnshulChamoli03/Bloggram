import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard: ensure required env vars exist to avoid cryptic runtime errors
const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseKeys.length > 0) {
  // Surface a readable error early during app startup
  const readable = missingFirebaseKeys.join(', ');
  // eslint-disable-next-line no-console
  console.error(`Missing Firebase configuration: ${readable}. Did you set VITE_FIREBASE_* in Frontend/.env and restart dev server?`);
  throw new Error('Firebase configuration is incomplete. Check Frontend/.env values.');
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload media files to Firebase Storage
 * @param {FileList|File[]} files - Array of files to upload
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMedia(files, userId) {
  if (!files || files.length === 0) return [];
  
  const uploads = Array.from(files).map(async (file) => {
    const timestamp = Date.now();
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const storagePath = `posts/${userId}/${timestamp}_${fileName}`;
    const fileRef = ref(storage, storagePath);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  });
  
  return await Promise.all(uploads);
}

export default app;

