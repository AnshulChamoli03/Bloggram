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

// Check for missing Firebase configuration
const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let app;
let storage;

if (missingFirebaseKeys.length > 0) {
  // Firebase not configured - app will run but uploads won't work
} else {
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
  } catch (error) {
    // Failed to initialize Firebase
  }
}

/**
 * Upload media files to Firebase Storage
 * @param {FileList|File[]} files - Array of files to upload
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMedia(files, userId) {
  if (!files || files.length === 0) return [];
  
  // Check if Firebase is configured
  if (!storage) {
    throw new Error('Firebase is not configured. Please set VITE_FIREBASE_* environment variables in Frontend/.env file.');
  }

  if (!userId) {
    throw new Error('User ID is required for file upload');
  }

  const uploads = Array.from(files).map(async (file, index) => {
    try {
      // Validate file
      if (!file || !(file instanceof File)) {
        throw new Error(`Invalid file at index ${index}`);
      }

      // Check file size (limit to 10MB per file)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
      }

      const timestamp = Date.now();
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
      const storagePath = `posts/${userId}/${timestamp}_${fileName}`;
      const fileRef = ref(storage, storagePath);
      
      // Upload file
      await uploadBytes(fileRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(fileRef);
      
      return downloadURL;
    } catch (error) {
      
      // Provide user-friendly error messages
      if (error.code === 'storage/unauthorized') {
        throw new Error(`Upload failed: Permission denied. Please check Firebase Storage rules.`);
      } else if (error.code === 'storage/canceled') {
        throw new Error(`Upload canceled for file "${file?.name}"`);
      } else if (error.code === 'storage/unknown') {
        throw new Error(`Upload failed: Unknown error. Please check your internet connection and Firebase configuration.`);
      } else if (error.message) {
        throw new Error(`Upload failed: ${error.message}`);
      } else {
        throw new Error(`Failed to upload file "${file?.name}". Please try again.`);
      }
    }
  });
  
  try {
    return await Promise.all(uploads);
  } catch (error) {
    throw error; // Re-throw to be caught by calling component
  }
}

/**
 * Upload a single profile picture for a user.
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} Download URL of uploaded profile image
 */
export async function uploadProfilePicture(file, userId) {
  if (!file || !userId) {
    throw new Error('File and user ID are required');
  }

  // Check if Firebase is configured
  if (!storage) {
    throw new Error('Firebase is not configured. Please set VITE_FIREBASE_* environment variables in Frontend/.env file.');
  }

  try {
    // Validate file type (only images)
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed for profile pictures');
    }

    // Check file size (limit to 5MB for profile pictures)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Profile picture is too large. Maximum size is 5MB.');
    }

    const timestamp = Date.now();
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `profiles/${userId}/${timestamp}_${fileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;
  } catch (error) {
    
    // Provide user-friendly error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Upload failed: Permission denied. Please check Firebase Storage rules.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload canceled');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed: Unknown error. Please check your internet connection and Firebase configuration.');
    } else if (error.message) {
      throw error; // Re-throw with original message
    } else {
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  }
}

export default app;

