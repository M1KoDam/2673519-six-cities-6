import { Helmet } from 'react-helmet-async';
import { useStoreDispatch, useStoreState } from '@store/hooks';
import { useState, useEffect } from 'react';
import { fetchOffers, login } from '@store/api-actions';
import { useNavigate } from 'react-router-dom';
import { AppRoute, Cities } from '@consts';
import { AuthStatus, City } from '@types';
import { getAuthorizationStatus } from '@store/user-data/selectors';
import { cityChanged } from '@store/app-data/app-data';

export default function LoginPage() : JSX.Element {
  const dispatch = useStoreDispatch();
  const navigate = useNavigate();
  const authStatus = useStoreState(getAuthorizationStatus);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [promoCity] = useState<City>(() => Cities[Math.floor(Math.random() * Cities.length)].city);

  const getPasswordError = (nextPassword: string): string => {
    if (nextPassword.length === 0) {
      return '';
    }

    if (nextPassword.includes(' ')) {
      return 'Password cannot contain spaces';
    }

    if (nextPassword.length < 4) {
      return 'Password must be at least 4 characters';
    }

    const hasLetterAndDigit = /(?=.*\p{L})(?=.*\d)/u.test(nextPassword);
    if (!hasLetterAndDigit) {
      return 'Password must contain at least 1 letter and 1 digit';
    }

    return '';
  };

  useEffect(() => {
    if (authStatus === AuthStatus.Auth) {
      navigate(AppRoute.Root);
    }
  }, [authStatus, navigate]);

  const handlePromoCityClick = () => {
    dispatch(cityChanged(promoCity));
    navigate(AppRoute.Root);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const nextPasswordError = getPasswordError(password);
    if (nextPasswordError) {
      setPasswordError(nextPasswordError);
      setLoginError('');
      return;
    }

    setPasswordError('');
    setLoginError('');

    dispatch(login({ email, password })).then((result) => {
      if (login.fulfilled.match(result)) {
        dispatch(fetchOffers());
        navigate(AppRoute.Root);
      } else if (login.rejected.match(result)) {
        setLoginError(result.payload || 'Не удалось войти. Попробуйте ещё раз.');
      }
    });
  };

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>6 cities: Authorization</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href={ AppRoute.Root }>
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              {loginError && (
                <div className="login__error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input className="login__input form__input" type="email" name="email" placeholder="Email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input className="login__input form__input" type="password" name="password" placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    const nextPassword = e.target.value;
                    setPassword(nextPassword);
                    setPasswordError(getPasswordError(nextPassword));
                    setLoginError('');
                  }}
                  required
                />
                {passwordError && <div role="alert" style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <button
                className="locations__item-link"
                type="button"
                onClick={handlePromoCityClick}
              >
                <span>{promoCity.name}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
