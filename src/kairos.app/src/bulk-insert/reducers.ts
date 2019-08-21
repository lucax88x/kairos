import { reduce } from 'ramda';

import { BulkInsertActions } from '../actions';
import { bulkInsertTimeEntriesReducer } from './bulk-insert-time-entries';
import { bulkInsertTimeAbsenceEntriesReducer } from './bulk-insert-time-absence-entries';
import { bulkInsertTimeHolidayEntriesReducer } from './bulk-insert-time-holiday-entries';
import { BulkInsertState, bulkInsertStateInitialState } from './state';

const reducers = [
  bulkInsertTimeEntriesReducer,
  bulkInsertTimeAbsenceEntriesReducer,
  bulkInsertTimeHolidayEntriesReducer,
];

export const bulkInsertReducers = (
  state = bulkInsertStateInitialState,
  action: BulkInsertActions,
): BulkInsertState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
