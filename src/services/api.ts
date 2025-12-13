import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getStorageToken } from './token';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

type DetailMessageType = {
  type: string;
  message: string;
}

export class ServerUnavailableError extends Error {
  constructor(message = 'Сервер временно недоступен. Пожалуйста, попробуйте позже.') {
    super(message);
    this.name = 'ServerUnavailableError';
  }
}

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStorageToken();

      if (token && config.headers) {
        config.headers['x-token'] = token;
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

      throw error;
    }
  );

  return api;
};
