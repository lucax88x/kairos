import { reduce } from 'ramda';

import { LayoutActions } from '../actions';
import { closeLeftDrawerReducer } from './close-left-drawer';
import { closeTimeAbsenceEntryDrawerReducer } from './close-time-absence-entry-drawer';
import { closeTimeEntryDrawerReducer } from './close-time-entry-drawer';
import { openLeftDrawerReducer } from './open-left-drawer';
import { openTimeAbsenceEntryDrawerReducer } from './open-time-absence-entry-drawer';
import { openTimeEntryDrawerReducer } from './open-time-entry-drawer';
import { layoutInitialState, LayoutState } from './state';

const reducers = [
  openLeftDrawerReducer,
  closeLeftDrawerReducer,
  openTimeEntryDrawerReducer,
  closeTimeEntryDrawerReducer,
  openTimeAbsenceEntryDrawerReducer,
  closeTimeAbsenceEntryDrawerReducer,
];

export const layoutReducers = (state = layoutInitialState, action: LayoutActions): LayoutState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
