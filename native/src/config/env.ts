import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, '');

export const API_BASE_URL = normalizeBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'https://not.reyml.com'
);

export const SHARE_URL = process.env.EXPO_PUBLIC_SHARE_URL ?? extra.shareUrl ?? 'https://not.reyml.com';

export const APP_NAME = Constants.expoConfig?.name ?? 'Not Hamburger';
