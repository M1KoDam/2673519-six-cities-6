import { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StoreDispatch, StoreState } from './types';
import { Offer, Review } from '@types';
import { offersLoaded, offerUpdated, reviewsLoaded, authRequired, setDataLoadingStatus, setEmail } from './actions';
import { saveStorageToken, dropStorageToken } from '@services/token';
import { APIRoute, AuthStatus } from '@types';
import { User } from '@types';

type AuthData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

type ErrorResponse = {
  message?: string;
  error?: string;
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  void,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/fetchOffers',
  async (_, { dispatch, extra: api, rejectWithValue }) => {
    try {
      dispatch(setDataLoadingStatus(true));
      const { data } = await api.get<Offer[]>(APIRoute.Offers);
      dispatch(offersLoaded(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch offers';
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setDataLoadingStatus(false));
    }
  }
);

export const checkAuth = createAsyncThunk<
  User | null,
  void,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'user/checkAuth',
  async (_, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<User>(APIRoute.Login);
      dispatch(authRequired(AuthStatus.Auth));
      if (data.email) {
        dispatch(setEmail(data.email));
      }
      return data;
    } catch (error) {
      dispatch(authRequired(AuthStatus.NoAuth));
      const errorMessage = error instanceof Error
        ? error.message
        : 'Authentication failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const login = createAsyncThunk<
  User,
  AuthData,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<LoginResponse>(APIRoute.Login, { email, password });

      saveStorageToken(data.token);
      dispatch(authRequired(AuthStatus.Auth));
      dispatch(setEmail(data.user.email ?? email));

      return data.user;
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const responseData = axiosError.response?.data;

        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (axiosError.response?.status === 400) {
          errorMessage = 'Invalid email or password';
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk<
  void,
  void,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'user/logout',
  async (_, { dispatch, extra: api, rejectWithValue }) => {
    try {
      await api.delete(APIRoute.Logout);
      dropStorageToken();
      dispatch(authRequired(AuthStatus.NoAuth));
    } catch (error) {
      dropStorageToken();
      dispatch(authRequired(AuthStatus.NoAuth));

      const errorMessage = error instanceof Error
        ? error.message
        : 'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOffer = createAsyncThunk<
  Offer,
  string,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/fetchOffer',
  async (offerId, { dispatch, extra: api, rejectWithValue }) => {
    try {
      dispatch(setDataLoadingStatus(true));
      const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
      dispatch(offerUpdated(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch offer';
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setDataLoadingStatus(false));
    }
  }
);

export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/fetchReviews',
  async (offerId, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
      dispatch(reviewsLoaded(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch reviews';
      return rejectWithValue(errorMessage);
    }
  }
);
