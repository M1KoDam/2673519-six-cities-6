import { Link } from 'react-router-dom';
import { AppRoute } from '@consts';
import { Offer, AuthStatus } from '@types';
import { useStoreDispatch, useStoreState } from '@store/index';
import { logout } from '@store/api-actions';

type HeaderNavProps = {
  offers: Offer[];
};

export default function HeaderNav({offers}: HeaderNavProps): JSX.Element {
  const dispatch = useStoreDispatch();
  const authStatus = useStoreState((state) => state.authStatus);
  const email = useStoreState((state) => state.email);
  const favoritesCount = offers.filter((offer) => offer.isFavorite).length;

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
                <span className="header__user-name user__name">{email}</span>
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
