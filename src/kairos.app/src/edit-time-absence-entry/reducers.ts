import { reduce } from 'ramda';

import { EditTimeAbsenceEntryActions } from '../actions';
import { getTimeAbsenceEntryReducer } from './get-time-absence-entry';
import { editTimeAbsenceEntryInitialState, EditTimeAbsenceEntryState } from './state';
import { updateTimeAbsenceEntryReducer } from './update-time-absence-entry';

const reducers = [getTimeAbsenceEntryReducer, updateTimeAbsenceEntryReducer];

export const EditTimeAbsenceEntryReducers = (
  state = editTimeAbsenceEntryInitialState,
  action: EditTimeAbsenceEntryActions,
): EditTimeAbsenceEntryState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
