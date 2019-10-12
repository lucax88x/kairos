import { reduce } from 'ramda';
import { SharedActions } from '../actions';
import { createTimeAbsenceEntryReducer } from './create-time-absence-entry';
import { createTimeEntryReducer } from './create-time-entry';
import { createTimeHolidayEntryReducer } from './create-time-holiday-entry';
import { deleteTimeAbsenceEntriesReducer } from './delete-time-absence-entries';
import { deleteTimeEntriesReducer } from './delete-time-entries';
import { deleteTimeHolidayEntriesReducer } from './delete-time-holiday-entries';
import { getCountriesReducer } from './get-countries';
import { getTimeAbsenceEntriesReducer } from './get-time-absence-entries';
import { getTimeEntriesReducer } from './get-time-entries';
import { getTimeHolidayEntriesReducer } from './get-time-holiday-entries';
import { selectYearReducer } from './select-year';
import { selectLanguageReducer } from './select-language';
import { sharedInitialState, SharedState } from './state';
import { updateTimeHolidayEntriesByCountryReducer } from './update-time-holiday-entries-by-country';

const reducers = [
  getCountriesReducer,
  getTimeEntriesReducer,
  createTimeEntryReducer,
  deleteTimeEntriesReducer,
  getTimeAbsenceEntriesReducer,
  createTimeAbsenceEntryReducer,
  deleteTimeAbsenceEntriesReducer,
  getTimeHolidayEntriesReducer,
  createTimeHolidayEntryReducer,
  deleteTimeHolidayEntriesReducer,
  selectYearReducer,
  selectLanguageReducer,
  updateTimeHolidayEntriesByCountryReducer,
];

export const sharedReducers = (state = sharedInitialState, action: SharedActions): SharedState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
