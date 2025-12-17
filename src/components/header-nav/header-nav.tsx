import React from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '@consts';
import { AuthStatus } from '@types';
import { useStoreDispatch, useStoreState } from '@store/hooks';
import { logout } from '@store/api-actions';
import { getAuthorizationStatus, getUser } from '@store/user-data/selectors';
import { getFavoritesCount } from '@store/offers-data/selectors';

function HeaderNav(): JSX.Element {
  const dispatch = useStoreDispatch();
  const authStatus = useStoreState(getAuthorizationStatus);
  const user = useStoreState(getUser);
  const favoritesCount = useStoreState(getFavoritesCount);

  const handleLogoutClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logout());
  };

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {authStatus === AuthStatus.Auth ? (
          <>
            <li className="header__nav-item user">
              <Link
                className="header__nav-link header__nav-link--profile"
                to={AppRoute.Favorites}
              >
                <div className="header__avatar-wrapper user__avatar-wrapper">
                </div>
                <span className="header__user-name user__name">{user?.email}</span>
                <span className="header__favorite-count">{favoritesCount}</span>
              </Link>
            </li>
            <li className="header__nav-item">
              <a
                className="header__nav-link"
                href="#"
                onClick={handleLogoutClick}
              >
                <span className="header__signout">Sign out</span>
              </a>
            </li>
          </>
        ) : (
          <li className="header__nav-item user">
            <Link
              className="header__nav-link header__nav-link--profile"
              to={AppRoute.Login}
            >
              <div className="header__avatar-wrapper user__avatar-wrapper">
              </div>
              <span className="header__login">Sign in</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

const MemoizedHeaderNav = React.memo(HeaderNav);
MemoizedHeaderNav.displayName = 'HeaderNav';

export default MemoizedHeaderNav;
