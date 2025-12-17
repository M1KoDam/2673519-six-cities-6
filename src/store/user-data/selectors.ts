import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '@store/namespace.enum';
import { StoreState } from '@store/types';
import { AuthStatus, User } from '@types';

const selectUserState = (state: StoreState) => state[NameSpace.User];

export const getAuthorizationStatus = createSelector(
  [selectUserState],
  (userState): AuthStatus => userState.authorizationStatus
);

export const getUser = createSelector(
  [selectUserState],
  (userState): User | null => userState.user
);
