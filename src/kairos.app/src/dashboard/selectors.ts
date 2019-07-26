import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.dashboard;

export const selectTimeEntries = createSelector(
  selectState,
  state => state.timeEntries,
);

export const selectTimeAbsenceEntries = createSelector(
  selectState,
  state => state.timeAbsenceEntries,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsGetTimeEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeEntries,
);

export const selectIsGetTimeAbsenceEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeAbsenceEntries,
);
