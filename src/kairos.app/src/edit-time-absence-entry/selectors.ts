import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.editTimeAbsenceEntry;

export const selectTimeAbsenceEntry = createSelector(
  selectState,
  state => state.timeAbsenceEntry,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsGetTimeAbsenceEntryBusy = createSelector(
  selectBusy,
  busy => busy.getTimeAbsenceEntry,
);

export const selectIsUpdateTimeAbsenceEntryBusy = createSelector(
  selectBusy,
  busy => busy.updateTimeAbsenceEntry,
);
