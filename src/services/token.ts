const STORAGE_TOKEN_NAME = 'six-cities-token';

export const saveStorageToken = (token: string): void => {
  localStorage.setItem(STORAGE_TOKEN_NAME, token);
};

export const getStorageToken = (): string | null => {
  const token = localStorage.getItem(STORAGE_TOKEN_NAME);
  return token;
};

export const dropStorageToken = (): void => {
  localStorage.removeItem(STORAGE_TOKEN_NAME);
};
