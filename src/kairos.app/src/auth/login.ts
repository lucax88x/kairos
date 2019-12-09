import { push } from 'connected-react-router';
import { produce } from 'immer';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { AuthActions } from '../actions';
import { UserModel } from '../models/user.model';
import { RouteMatcher, buildPrivateRouteWithYear } from '../routes';
import { authService } from './auth.service';
import { LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from './constants';
import { AuthState } from './state';
import { selectSelectedYear } from '../shared/selectors';

export const loginAsync = createAsyncAction(
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
)<void, UserModel, string>();

function* login() {
  const user: UserModel = yield call([authService, authService.login]);

  if (!!user) {
    yield put(loginAsync.success(user));
  } else {
    yield put(loginAsync.failure('Failed'));
  }
}

function* redirectIfLoginSuccess() {
  const selectedYear = yield select(selectSelectedYear);
  yield put(push(buildPrivateRouteWithYear(RouteMatcher.Dashboard, selectedYear)));
}

export function* loginSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(LOGIN_SUCCESS, redirectIfLoginSuccess);
}

export const loginReducer = (
  state: AuthState,
  action: AuthActions,
): AuthState =>
  produce(state, draft => {
    switch (action.type) {
      case LOGIN:
        draft.ui.busy.login = true;
        break;
      case LOGIN_SUCCESS:
        draft.ui.busy.login = false;
        draft.user = action.payload;
        break;
      case LOGIN_FAILURE:
        draft.ui.busy.login = false;
        break;
    }
  });
