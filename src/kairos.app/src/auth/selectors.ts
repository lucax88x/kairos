import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectState,
  state => state.isAuthenticated,
);

export const selectUser = createSelector(
  selectState,
  state => state.user,
);
