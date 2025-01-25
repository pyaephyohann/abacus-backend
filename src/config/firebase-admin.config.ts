import * as admin from 'firebase-admin';
import * as serviceAccount from './abacus-myanmar-firebase-adminsdk-qzk01-a94fa802d7.json';
import { config } from './config';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: config.firebaseStorageBucket,
});

export const firebaseAdmin = admin;
