import { createMatchSelector } from 'connected-react-router';
import { createSelector } from 'reselect';

import { Routes } from '../routes';
import { State } from '../state';

export const selectDashboardRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.Dashboard),
);

export const selectEditTimeEntryRoute = createSelector(
  (state: State) => state,
  createMatchSelector(Routes.EditTimeEntry),
);
