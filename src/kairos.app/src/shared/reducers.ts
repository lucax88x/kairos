import { reduce } from 'ramda';

import { SharedActions } from '../actions';
import { createTimeAbsenceEntryReducer } from './create-time-absence-entry';
import { createTimeEntryReducer } from './create-time-entry';
import { createTimeHolidayEntryReducer } from './create-time-holiday-entry';
import { deleteTimeAbsenceEntryReducer } from './delete-time-absence-entry';
import { deleteTimeEntryReducer } from './delete-time-entry';
import { deleteTimeHolidayEntryReducer } from './delete-time-holiday-entry';
import { getTimeAbsenceEntriesReducer } from './get-time-absence-entries';
import { getTimeEntriesReducer } from './get-time-entries';
import { getCountriesReducer } from './get-countries';
import { getTimeHolidayEntriesReducer } from './get-time-holiday-entries';
import { sharedInitialState, SharedState } from './state';

const reducers = [
  getCountriesReducer,
  getTimeEntriesReducer,
  createTimeEntryReducer,
  deleteTimeEntryReducer,
  getTimeAbsenceEntriesReducer,
  createTimeAbsenceEntryReducer,
  deleteTimeAbsenceEntryReducer,
  getTimeHolidayEntriesReducer,
  createTimeHolidayEntryReducer,
  deleteTimeHolidayEntryReducer,
];

export const sharedReducers = (state = sharedInitialState, action: SharedActions): SharedState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
