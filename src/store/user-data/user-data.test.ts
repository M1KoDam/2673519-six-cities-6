import { describe, expect, it } from 'vitest';
import { userData, setAuthorizationStatus, setUser } from './user-data';
import { AuthStatus, User } from '@types';

describe('UserData reducer', () => {
  it('Returns initial state with unknown action', () => {
    const state = userData.reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      authorizationStatus: AuthStatus.Unknown,
      user: null,
    });
  });

  it('Handles setAuthorizationStatus', () => {
    const state = userData.reducer(undefined, setAuthorizationStatus(AuthStatus.Auth));

    expect(state.authorizationStatus).toBe(AuthStatus.Auth);
  });

  it('Handles setUser', () => {
    const user: User = {
      name: 'Test',
      avatarUrl: 'img/avatar.jpg',
      isPro: true,
      email: 'test@example.com',
      token: 'token',
    };

    const state = userData.reducer(undefined, setUser(user));

    expect(state.user).toEqual(user);
  });
});
