import { push } from 'connected-react-router';
import { produce } from 'immer';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { AuthActions } from '../actions';
import { UserModel } from '../models/user.model';
import { getProfileAsync } from '../profile/actions';
import { RouteMatcher, buildPrivateRouteWithYear } from '../routes';
import { authService } from './auth.service';
import {
  CHECK_IS_AUTHENTICATED,
  IS_ANONYMOUS,
  IS_AUTHENTICATED,
} from './constants';
import { AuthState } from './state';
import { selectLoginRoute } from '../shared/router.selectors';
import { Route } from '../models/route.model';
import { selectSelectedYear } from '../shared/selectors';

export const checkIsAuthenticated = () => action(CHECK_IS_AUTHENTICATED);
export const isAuthenticated = (user: UserModel) =>
  action(IS_AUTHENTICATED, user);
export const isAnonymous = () => action(IS_ANONYMOUS);

function* initAuth0() {
  const user: UserModel = yield call([authService, authService.init]);

  if (!user.isEmpty()) {
    yield put(isAuthenticated(user));
  } else {
    yield put(isAnonymous());
  }
}

function* redirectIfAnonymous() {
  yield put(push(RouteMatcher.Login));
}

function* doWhenAuthenticated() {
  yield put(getProfileAsync.request());

  const loginRoute: Route = yield select(selectLoginRoute);

  if (!!loginRoute) {
    const selectedYear = yield select(selectSelectedYear);
    yield put(push(buildPrivateRouteWithYear(RouteMatcher.Dashboard, selectedYear)));
  }
}

export function* checkIsAuthenticatedSaga() {
  yield takeLatest(CHECK_IS_AUTHENTICATED, initAuth0);
  yield takeLatest(IS_AUTHENTICATED, doWhenAuthenticated);
  yield takeLatest(IS_ANONYMOUS, redirectIfAnonymous);
  yield put(checkIsAuthenticated());
}

export const checkIsAuthenticatedReducer = (
  state: AuthState,
  action: AuthActions,
): AuthState =>
  produce(state, draft => {
    switch (action.type) {
      case CHECK_IS_AUTHENTICATED:
        draft.ui.busy.auth = true;
        draft.isAuthenticated = false;
        break;
      case IS_AUTHENTICATED:
        draft.ui.busy.auth = false;
        draft.user = action.payload;
        draft.isAuthenticated = true;
        break;
      case IS_ANONYMOUS:
        draft.ui.busy.auth = false;
        break;
    }
  });
