import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.bulkInsert;

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectIsBulkTimeEntriesInsertBusy = createSelector(
  selectBusy,
  busy => busy.bulkTimeEntriesInsert,
);
