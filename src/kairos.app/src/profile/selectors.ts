import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.profile;

export const selectProfile = createSelector(
  selectState,
  state => state.profile,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsGetProfileBusy = createSelector(
  selectBusy,
  busy => busy.getProfile,
);

export const selectIsUpdateProfileBusy = createSelector(
  selectBusy,
  busy => busy.updateProfile,
);
