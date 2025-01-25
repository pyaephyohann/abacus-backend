interface Config {
  jwtSecret: string;
  smsPohToken: string;
  smsPohBaseUrl: string;
  firebaseStorageBucket: string;
}

export const config: Config = {
  jwtSecret: process.env.JWT_SECRET || '',
  smsPohToken: process.env.SMS_POH_TOKEN || '',
  smsPohBaseUrl: process.env.SMS_POH_BASE_URL || '',
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
};
