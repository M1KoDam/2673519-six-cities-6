import { Helmet } from 'react-helmet-async';
import { useStoreDispatch, useStoreState } from '@store/hooks';
import { useState, useEffect } from 'react';
import { fetchOffers, login } from '@store/api-actions';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '@consts';
import { AuthStatus } from '@types';
import { getAuthorizationStatus } from '@store/user-data/selectors';

export default function LoginPage() : JSX.Element {
  const dispatch = useStoreDispatch();
  const navigate = useNavigate();
  const authStatus = useStoreState(getAuthorizationStatus);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  useEffect(() => {
    if (authStatus === AuthStatus.Auth) {
      navigate(AppRoute.Root);
    }
  }, [authStatus, navigate]);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (password.includes(' ')) {
      setPasswordError('Password cannot contain spaces');
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
        setLoginError(result.payload || 'Login failed');
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
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                {passwordError && <div style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
