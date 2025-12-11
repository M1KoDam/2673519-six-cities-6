import { Navigate } from 'react-router-dom';
import { AppRoute } from '@consts';
import { AuthStatus } from '@types';

type PrivateRouteProps = {
  authorizationStatus: AuthStatus;
  children: JSX.Element;
}

export default function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const {authorizationStatus, children} = props;

  return (
    authorizationStatus === AuthStatus.Auth
      ? children
      : <Navigate to={ AppRoute.Login }/>
  );
}

