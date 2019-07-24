import { produce } from 'immer';
import { call, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { AuthActions } from '../actions';
import { authService } from './auth.service';
import { LOGOUT } from './constants';
import { AuthState } from './state';

export const logout = () => action(LOGOUT);

function* doLogout() {
  yield call([authService, authService.logout]);
}

export function* logoutSaga() {
  yield takeLatest(LOGOUT, doLogout);
}

export const logoutReducer = (state: AuthState, action: AuthActions): AuthState =>
  produce(state, draft => {
    switch (action.type) {
      case LOGOUT:
        draft.ui.busy.logout = true;
        break;
    }
  });
