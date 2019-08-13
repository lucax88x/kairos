import { createMatchSelector } from 'connected-react-router';
import { createSelector } from 'reselect';

import { Routes } from '../routes';
import { State } from '../state';

export const selectProfileRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.Profile),
);

export const selectDashboardRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.Dashboard),
);

export const selectTimeEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.TimeEntries),
);

export const selectTimeAbsenceEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.TimeAbsenceEntries),
);

export const selectTimeHolidayEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.TimeHolidayEntries),
);

export const selectEditTimeEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.EditTimeEntry),
);

export const selectEditTimeAbsenceEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.EditTimeAbsenceEntry),
);
