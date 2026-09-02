import admin from 'firebase-admin';

// Singleton pattern — prevent re-initialization in Next.js hot reload
let _firestoreAvailable = false;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const hasRealCreds =
    projectId &&
    clientEmail &&
    privateKey &&
    !projectId.includes('your-firebase') &&
    !projectId.includes('-dev') &&
    !clientEmail.includes('dev@student-career-os') &&
    !privateKey.includes('...');

  if (hasRealCreds) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    _firestoreAvailable = true;
  } else {
    // No real credentials — run in in-memory mode only.
    // Only mark Firestore as available if FIRESTORE_EMULATOR_HOST is explicitly
    // set to something other than our default placeholder OR if real creds exist.
    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
    const emulatorIsDefault = !emulatorHost || emulatorHost === '127.0.0.1:8080';

    // Always initialize the admin app (needed so admin.firestore() doesn't throw)
    if (emulatorIsDefault) {
      // Point to localhost emulator but mark as unavailable so we skip calls
      process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    }
    admin.initializeApp({
      projectId: projectId || 'student-career-os-dev',
    });
    // Mark as unavailable — we'll use in-memory fallback
    _firestoreAvailable = false;
  }
}

// Export whether Firestore is actually reachable
export const firestoreAvailable = _firestoreAvailable;
export const db = admin.firestore();
export default admin;
