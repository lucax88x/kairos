import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.shared;

export const selectTimeEntries = createSelector(
  selectState,
  state => state.timeEntries,
);

export const selectTimeAbsenceEntries = createSelector(
  selectState,
  state => state.timeAbsenceEntries,
);

export const selectTimeHolidayEntries = createSelector(
  selectState,
  state => state.timeHolidayEntries,
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

export const selectIsCreateTimeEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeEntry,
);

export const selectIsDeleteTimeEntryBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeEntry,
);

export const selectIsGetTimeAbsenceEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeAbsenceEntries,
);

export const selectIsCreateTimeAbsenceEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeAbsenceEntry,
);

export const selectIsDeleteTimeAbsenceEntryBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeAbsenceEntry,
);

export const selectIsGetTimeHolidayEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeHolidayEntries,
);

export const selectIsCreateTimeHolidayEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeHolidayEntry,
);

export const selectIsDeleteTimeHolidayEntryBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeHolidayEntry,
);
