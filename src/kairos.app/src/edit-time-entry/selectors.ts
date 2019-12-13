import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.editTimeEntry;

export const selectTimeEntry = createSelector(
  selectState,
  state => state.timeEntry,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsGetTimeEntryBusy = createSelector(
  selectBusy,
  busy => busy.getTimeEntry,
);

export const selectIsUpdateTimeEntryAsInBusy = createSelector(
  selectBusy,
  busy => busy.updateTimeEntryAsIn,
);

export const selectIsUpdateTimeEntryAsOutBusy = createSelector(
  selectBusy,
  busy => busy.updateTimeEntryAsOut,
);
