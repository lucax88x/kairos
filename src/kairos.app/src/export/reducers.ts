import { reduce } from 'ramda';
import { ExportActions } from '../actions';
import { exportTimeAbsenceEntriesReducer } from './export-time-absence-entries';
import { exportTimeEntriesReducer } from './export-time-entries';
import { ExportState, exportStateInitialState } from './state';

const reducers = [exportTimeEntriesReducer, exportTimeAbsenceEntriesReducer];

export const exportReducers = (
  state = exportStateInitialState,
  action: ExportActions,
): ExportState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
