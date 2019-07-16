import { reduce } from 'ramda';

import { SharedActions } from '../actions';
import { createTimeEntryReducer } from './create-time-entry';
import { sharedInitialState, SharedState } from './state';

const reducers = [createTimeEntryReducer];

export const sharedReducers = (state = sharedInitialState, action: SharedActions): SharedState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
