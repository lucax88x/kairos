import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.editTimeHolidayEntry;

export const selectTimeHolidayEntry = createSelector(
  selectState,
  state => state.timeHolidayEntry,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsGetTimeHolidayEntryBusy = createSelector(
  selectBusy,
  busy => busy.getTimeHolidayEntry,
);

export const selectIsUpdateTimeHolidayEntryBusy = createSelector(
  selectBusy,
  busy => busy.updateTimeHolidayEntry,
);
