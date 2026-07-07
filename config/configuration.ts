import { ServiceAccount } from 'firebase-admin';

export default () => {
  const googleServiceAccountString = Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT_B64 ?? '',
    'base64',
  ).toString('utf-8');

  const googleServiceAccount = JSON.parse(
    googleServiceAccountString,
  ) as ServiceAccount;

  return {
    users: {
      a: process.env.USER_A,
      b: process.env.USER_B,
    },
    redisUrl: process.env.CACHE_URL,
    googleServiceAccount,
  };
};
