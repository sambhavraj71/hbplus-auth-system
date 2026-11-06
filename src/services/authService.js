
import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const ALLOWED_DOMAIN = '@hbplus.fit';

export const ACCESS_ERROR =
  'Access restricted. Please login using your official domain email.';

export const getAuthInstance = async () => {
  if (Platform.OS === 'web') {
    const module = await import('../config/auth.web');
    return module.auth;
  }

  const module = await import('../config/auth.native');
  return module.auth;
};

export const isAuthorizedEmail = (email) => {
  if (!email) return false;

  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
};

export const signInWithGoogle = async () => {
  const auth = await getAuthInstance();

  if (Platform.OS !== 'web') {
    throw new Error(
      'Native Google sign-in will be configured separately.'
    );
  }

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account',
    hd: 'hbplus.fit',
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.emailVerified || !isAuthorizedEmail(user.email)) {
      await signOut(auth);
      throw new Error(ACCESS_ERROR);
    }

    return user;
  } catch (error) {
    if (error.message === ACCESS_ERROR) {
      throw error;
    }

    throw error;
  }
};

export const logoutUser = async () => {
  const auth = await getAuthInstance();
  return signOut(auth);
};
