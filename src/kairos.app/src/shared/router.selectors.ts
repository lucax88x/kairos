import { createMatchSelector } from 'connected-react-router';
import { createSelector } from 'reselect';

import { Routes } from '../routes';
import { State } from '../state';

export const selectTimeEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.TimeEntries),
);

export const selectTimeAbsenceEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.TimeAbsenceEntries),
);

export const selectEditTimeEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.EditTimeEntry),
);

export const selectEditTimeAbsenceEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.EditTimeAbsenceEntry),
);
