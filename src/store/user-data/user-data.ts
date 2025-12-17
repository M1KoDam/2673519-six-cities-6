import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { AuthStatus, User } from '@types';

type UserState = {
  authorizationStatus: AuthStatus;
  user: User | null;
};

const initialState: UserState = {
  authorizationStatus: AuthStatus.Unknown,
  user: null,
};

export const userData = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    setAuthorizationStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authorizationStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthorizationStatus, setUser } = userData.actions;
