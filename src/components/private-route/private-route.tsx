import { Navigate } from 'react-router-dom';
import { AppRoute } from '@consts';
import { AuthStatus } from '@types';
import { useStoreState } from '@store/hooks';

type PrivateRouteProps = {
  children: JSX.Element;
}

export default function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const {children} = props;
  const authorizationStatus = useStoreState((state) => state.authStatus);

  return (
    authorizationStatus === AuthStatus.Auth
      ? children
      : <Navigate to={ AppRoute.Login }/>
  );
}

