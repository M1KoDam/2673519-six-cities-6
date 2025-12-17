import { Navigate } from 'react-router-dom';
import { AppRoute } from '@consts';
import { AuthStatus } from '@types';
import { useStoreState } from '@store/hooks';
import { getAuthorizationStatus } from '@store/user-data/selectors';

type PrivateRouteProps = {
  children: JSX.Element;
}

export default function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const {children} = props;
  const authorizationStatus = useStoreState(getAuthorizationStatus);

  return (
    authorizationStatus === AuthStatus.Auth
      ? children
      : <Navigate to={ AppRoute.Login }/>
  );
}

