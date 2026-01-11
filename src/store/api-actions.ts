import { AxiosError, AxiosInstance, isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StoreDispatch, StoreState } from '@store/types';
import { Offer, Review, User, APIRoute, AuthStatus } from '@types';
import { saveStorageToken, dropStorageToken } from '@services/token';
import { loadOffers, setOffersDataLoadingStatus, updateOffer } from '@store/offers-data/offers-data';
import { setAuthorizationStatus, setUser } from '@store/user-data/user-data';
import { loadOfferInDetails, reviewsLoaded, addReview, setOfferInDetailsDataLoadingStatus, updateOfferInDetails } from '@store/current-offer-data/current-offer-data';

type AuthData = {
  email: string;
  password: string;
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
      dispatch(setOffersDataLoadingStatus(true));
      const { data } = await api.get<Offer[]>(APIRoute.Offers);
      dispatch(loadOffers(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch offers';
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setOffersDataLoadingStatus(false));
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
      dispatch(setAuthorizationStatus(AuthStatus.Auth));
      dispatch(setUser(data));
      return data;
    } catch (error) {
      dispatch(setAuthorizationStatus(AuthStatus.NoAuth));
      dispatch(setUser(null));
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
      const { data } = await api.post<User>(APIRoute.Login, { email, password });

      saveStorageToken(data.token);
      dispatch(setAuthorizationStatus(AuthStatus.Auth));
      dispatch(setUser(data));

      return data;
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Login failed';

      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const responseData = axiosError.response?.data;
        const status = axiosError.response?.status;

        if (status === 400 || status === 401) {
          return rejectWithValue('Invalid email or password');
        }

        const responseMessage = responseData?.message ?? responseData?.error;
        if (responseMessage) {
          if (/validation error/i.test(responseMessage) || /six-cities\/login/i.test(responseMessage)) {
            errorMessage = 'Invalid email or password';
          } else {
            errorMessage = responseMessage;
          }
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
      dispatch(setAuthorizationStatus(AuthStatus.NoAuth));
      dispatch(setUser(null));
    } catch (error) {
      dropStorageToken();
      dispatch(setAuthorizationStatus(AuthStatus.NoAuth));
      dispatch(setUser(null));

      const errorMessage = error instanceof Error
        ? error.message
        : 'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOfferDetails = createAsyncThunk<
  Offer,
  string,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/fetchOfferDetails',
  async (offerId, { dispatch, extra: api, rejectWithValue }) => {
    try {
      dispatch(setOfferInDetailsDataLoadingStatus(true));

      const [offerResponse, nearbyResponse, reviewsResponse] = await Promise.all([
        api.get<Offer>(`${APIRoute.Offers}/${offerId}`),
        api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`),
        api.get<Review[]>(`${APIRoute.Comments}/${offerId}`),
      ]);

      dispatch(updateOffer(offerResponse.data));
      dispatch(
        loadOfferInDetails({
          offerInfo: offerResponse.data,
          nearestOffers: nearbyResponse.data,
          reviews: reviewsResponse.data,
        })
      );

      return offerResponse.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return rejectWithValue('NOT_FOUND');
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch offer details';
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setOfferInDetailsDataLoadingStatus(false));
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendReview = createAsyncThunk<
  Review,
  { offerId: string; comment: string; rating: number },
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/sendReview',
  async ({ offerId, comment, rating }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<Review>(`${APIRoute.Comments}/${offerId}`, { comment, rating });
      dispatch(addReview(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send review';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchFavorites = createAsyncThunk<
  Offer[],
  void,
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/fetchFavorites',
  async (_, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Offer[]>(APIRoute.Favorite);
      data.forEach((offer) => dispatch(updateOffer(offer)));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch favorites';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleFavorite = createAsyncThunk<
  Offer,
  { offerId: string; status: 0 | 1 },
  {
    dispatch: StoreDispatch;
    state: StoreState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/toggleFavorite',
  async ({ offerId, status }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<Offer>(`${APIRoute.Favorite}/${offerId}/${status}`);
      dispatch(updateOffer(data));
      dispatch(updateOfferInDetails(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favorite';
      return rejectWithValue(errorMessage);
    }
  }
);
