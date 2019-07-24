import { push } from 'connected-react-router';
import { produce } from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { AuthActions } from '../actions';
import { UserModel } from '../models/user.model';
import { Routes } from '../routes';
import { authService } from './auth.service';
import { LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from './constants';
import { AuthState } from './state';

export const loginAsync = createAsyncAction(LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE)<
  void,
  UserModel,
  string
>();

function* login() {
  const user: UserModel = yield call([authService, authService.login]);

  if (!!user) {
    yield put(loginAsync.success(user));
  } else {
    yield put(loginAsync.failure('Failed'));
  }
}

function* redirectIfLoginSuccess() {
  yield put(push(Routes.Dashboard));
}

export function* loginSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(LOGIN_SUCCESS, redirectIfLoginSuccess);
}

export const loginReducer = (state: AuthState, action: AuthActions): AuthState =>
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
