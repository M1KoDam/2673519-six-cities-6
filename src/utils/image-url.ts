import { getStorageToken } from '@services/token';

export const addTokenToImageUrl = (url: string): string => {
  const token = getStorageToken();

  if (!token || !url) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}x-token=${encodeURIComponent(token)}`;
};
