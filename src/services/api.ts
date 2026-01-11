import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getStorageToken } from './token';
import { AuthStatus } from '@types';
import { setAuthorizationStatus } from '@store/user-data/user-data';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

type DetailMessageType = {
  type: string;
  message: string;
}

export class ServerUnavailableError extends Error {
  constructor(message = 'The server is temporarily unavailable. Please try again later.') {
    super(message);
    this.name = 'ServerUnavailableError';
  }
}

let dispatchFunction: ((action: ReturnType<typeof setAuthorizationStatus>) => void) | null = null;

export const setDispatch = (dispatch: (action: ReturnType<typeof setAuthorizationStatus>) => void) => {
  dispatchFunction = dispatch;
};

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStorageToken();

      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }

      return config;
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (!error.response) {
        throw new ServerUnavailableError();
      }

      if (error.response.status === 401 && dispatchFunction) {
        dispatchFunction(setAuthorizationStatus(AuthStatus.NoAuth));
      }

      throw error;
    }
  );

  return api;
};
