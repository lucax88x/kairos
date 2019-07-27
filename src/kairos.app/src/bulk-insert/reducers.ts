import { reduce } from 'ramda';

import { BulkInsertActions } from '../actions';
import { bulkInsertTimeEntriesReducer } from './bulk-insert-time-entries';
import { BulkInsertState, bulkInsertStateInitialState } from './state';

const reducers = [bulkInsertTimeEntriesReducer];

export const bulkInsertReducers = (
  state = bulkInsertStateInitialState,
  action: BulkInsertActions,
): BulkInsertState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
