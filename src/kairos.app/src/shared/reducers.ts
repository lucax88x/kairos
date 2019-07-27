import { reduce } from 'ramda';

import { SharedActions } from '../actions';
import { createTimeAbsenceEntryReducer } from './create-time-absence-entry';
import { createTimeEntryReducer } from './create-time-entry';
import { deleteTimeAbsenceEntryReducer } from './delete-time-absence-entry';
import { deleteTimeEntryReducer } from './delete-time-entry';
import { getTimeAbsenceEntriesReducer } from './get-time-absence-entries';
import { getTimeEntriesReducer } from './get-time-entries';
import { sharedInitialState, SharedState } from './state';

const reducers = [
  createTimeEntryReducer,
  deleteTimeEntryReducer,
  createTimeAbsenceEntryReducer,
  deleteTimeAbsenceEntryReducer,
  getTimeEntriesReducer,
  getTimeAbsenceEntriesReducer,
];

export const sharedReducers = (state = sharedInitialState, action: SharedActions): SharedState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
