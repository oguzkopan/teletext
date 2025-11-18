import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // In production, use Application Default Credentials
  // In development, you can use a service account key file
  if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Use Application Default Credentials (for Firebase App Hosting)
    admin.initializeApp();
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export default admin;
