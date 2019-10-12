import { createSelector } from 'reselect';
import { State } from '../state';

const selectState = (state: State) => state.export;

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsExportTimeEntriesBusy = createSelector(
  selectBusy,
  busy => busy.exportTimeEntries,
);

export const selectIsExportTimeAbsenceEntriesBusy = createSelector(
  selectBusy,
  busy => busy.exportTimeAbsenceEntries,
);
