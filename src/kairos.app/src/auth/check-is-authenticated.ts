import { push } from 'connected-react-router';
import { produce } from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { AuthActions } from '../actions';
import { UserModel } from '../models/user.model';
import { Routes } from '../routes';
import { authService } from './auth.service';
import { CHECK_IS_AUTHENTICATED, IS_ANONYMOUS, IS_AUTHENTICATED } from './constants';
import { AuthState } from './state';

export const checkIsAuthenticated = () => action(CHECK_IS_AUTHENTICATED);
export const isAuthenticated = (user: UserModel) => action(IS_AUTHENTICATED, user);
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
  yield put(push(Routes.Login));
}

export function* checkIsAuthenticatedSaga() {
  yield takeLatest(CHECK_IS_AUTHENTICATED, initAuth0);
  yield takeLatest(IS_ANONYMOUS, redirectIfAnonymous);
  yield put(checkIsAuthenticated());
}

export const checkIsAuthenticatedReducer = (state: AuthState, action: AuthActions): AuthState =>
  produce(state, draft => {
    switch (action.type) {
      case CHECK_IS_AUTHENTICATED:
        draft.ui.busy.auth = true;
        break;
      case IS_AUTHENTICATED:
        draft.ui.busy.auth = false;
        draft.user = action.payload;
        break;
      case IS_ANONYMOUS:
        draft.ui.busy.auth = false;
        break;
    }
  });
