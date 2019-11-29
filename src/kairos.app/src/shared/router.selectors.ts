import { createMatchSelector } from 'connected-react-router';
import { createSelector } from 'reselect';

import { RouteMatcher } from '../routes';
import { State } from '../state';

export const selectLoginRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.Login),
);

export const selectPrivateWithYearRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.PrivateWithYear),
);

export const selectProfileRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.Profile),
);

export const selectDashboardRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.Dashboard),
);

export const selectTimeEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.TimeEntries),
);

export const selectTimeAbsenceEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.TimeAbsenceEntries),
);

export const selectTimeHolidayEntriesRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.TimeHolidayEntries),
);

export const selectEditTimeEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.EditTimeEntry),
);

export const selectEditTimeAbsenceEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.EditTimeAbsenceEntry),
);

export const selectEditTimeHolidayEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(RouteMatcher.EditTimeHolidayEntry),
);
