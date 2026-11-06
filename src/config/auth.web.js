
import { getAuth } from 'firebase/auth';
import app from './firebase';

// Firebase automatically selects suitable persistence
// for the current browser or server environment.
export const auth = getAuth(app);
