import { reduce } from 'ramda';

import { AuthActions } from '../actions';
import { checkIsAuthenticatedReducer } from './check-is-authenticated';
import { loginReducer } from './login';
import { authInitialState, AuthState } from './state';

const reducers = [checkIsAuthenticatedReducer, loginReducer];

export const authReducers = (state = authInitialState, action: AuthActions): AuthState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
