import { reduce } from 'ramda';

import { DashboardActions } from '../actions';
import { getTimeAbsenceEntriesReducer } from './get-time-absence-entries';
import { getTimeEntriesReducer } from './get-time-entries';
import { dashboardInitialState, DashboardState } from './state';

const reducers = [getTimeEntriesReducer, getTimeAbsenceEntriesReducer];

export const dashboardReducers = (
  state = dashboardInitialState,
  action: DashboardActions,
): DashboardState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
