import { reduce } from 'ramda';

import { EditTimeEntryActions } from '../actions';
import { getTimeEntryReducer } from './get-time-entry';
import { editTimeEntryInitialState, EditTimeEntryState } from './state';
import { updateTimeEntryReducer } from './update-time-entry';

const reducers = [getTimeEntryReducer, updateTimeEntryReducer];

export const EditTimeEntryReducers = (
  state = editTimeEntryInitialState,
  action: EditTimeEntryActions,
): EditTimeEntryState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
