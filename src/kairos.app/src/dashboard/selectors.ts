import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.dashboard;

export const selectTimeEntries = createSelector(
  selectState,
  state => state.timeEntries,
);
