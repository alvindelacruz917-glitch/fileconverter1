import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// If firestoreDatabaseId is specified and not (default), pass it to getFirestore
const databaseId = firebaseConfigJson.firestoreDatabaseId;
export const db = (databaseId && databaseId !== '(default)')
  ? getFirestore(app, databaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication helper methods
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      // Save or update user profile document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );
    }
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Firestore User Admin helper methods
export interface FirestoreUserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  plan?: 'FREE' | 'PRO';
  credits?: number;
  isAdmin?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export const getAllFirestoreUsers = async (): Promise<FirestoreUserRecord[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const usersList: FirestoreUserRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      usersList.push({
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || data.email?.split('@')[0] || 'User',
        photoURL: data.photoURL,
        plan: data.plan || 'FREE',
        credits: typeof data.credits === 'number' ? data.credits : 5,
        isAdmin: !!data.isAdmin,
        lastLogin: data.lastLogin,
        createdAt: data.createdAt || data.lastLogin || new Date().toISOString()
      });
    });
    return usersList;
  } catch (err) {
    console.warn('Notice: Firestore users fetch error or permissions:', err);
    return [];
  }
};

export const updateFirestoreUserCredits = async (uid: string, credits: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { credits: Math.max(0, credits) }, { merge: true });
  } catch (err) {
    console.warn('Notice: Firestore credit update notice:', err);
  }
};

export const updateFirestoreUserPlan = async (uid: string, plan: 'FREE' | 'PRO') => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { plan }, { merge: true });
  } catch (err) {
    console.warn('Notice: Firestore plan update notice:', err);
  }
};

export const saveFirestoreUserDoc = async (userRecord: FirestoreUserRecord) => {
  try {
    const userRef = doc(db, 'users', userRecord.uid);
    await setDoc(userRef, userRecord, { merge: true });
  } catch (err) {
    console.warn('Notice: Firestore save user notice:', err);
  }
};

// Firestore conversion history helper functions
export interface ConversionHistoryRecord {
  id?: string;
  userId: string;
  fileName: string;
  fileSize: number;
  toolId: string;
  toolName: string;
  outputName: string;
  timestamp: string;
  status: 'completed' | 'failed';
}

export const saveConversionRecord = async (
  record: Omit<ConversionHistoryRecord, 'timestamp'>
) => {
  if (!auth.currentUser) {
    return;
  }
  const path = 'conversions';
  try {
    const historyRef = collection(db, path);
    await addDoc(historyRef, {
      ...record,
      userId: auth.currentUser.uid,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } else {
      console.error('Error saving conversion history to Firestore:', err);
    }
  }
};

export const getUserConversionHistory = async (userId: string) => {
  if (!auth.currentUser) return [];
  const path = 'conversions';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results: ConversionHistoryRecord[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...(doc.data() as Omit<ConversionHistoryRecord, 'id'>) });
    });
    return results;
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
      handleFirestoreError(err, OperationType.GET, path);
    } else {
      console.error('Error fetching conversion history from Firestore:', err);
    }
    return [];
  }
};

export const deleteConversionRecord = async (docId: string) => {
  if (!auth.currentUser) return;
  const path = `conversions/${docId}`;
  try {
    await deleteDoc(doc(db, 'conversions', docId));
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } else {
      console.error('Error deleting conversion record:', err);
    }
  }
};

// Presets / Favorites helpers
export const saveUserPreset = async (userId: string, toolId: string) => {
  if (!auth.currentUser) return;
  const path = 'presets';
  try {
    const presetRef = collection(db, path);
    await addDoc(presetRef, {
      userId: auth.currentUser.uid,
      toolId,
      addedAt: new Date().toISOString()
    });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } else {
      console.error('Error saving preset to Firestore:', err);
    }
  }
};

export const getUserPresets = async (userId: string) => {
  if (!auth.currentUser) return [];
  const path = 'presets';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const presets: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.toolId) presets.push(data.toolId);
    });
    return presets;
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
      handleFirestoreError(err, OperationType.GET, path);
    } else {
      console.error('Error fetching presets:', err);
    }
    return [];
  }
};

export { onAuthStateChanged };
export type { User };
