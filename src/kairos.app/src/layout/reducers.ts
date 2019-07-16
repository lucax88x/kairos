import { reduce } from 'ramda';

import { LayoutActions } from '../actions';
import { closeLeftDrawerReducer } from './close-left-drawer';
import { closeRightDrawerReducer } from './close-right-drawer';
import { openLeftDrawerReducer } from './open-left-drawer';
import { openRightDrawerReducer } from './open-right-drawer';
import { layoutInitialState, LayoutState } from './state';

const reducers = [
  openLeftDrawerReducer,
  closeLeftDrawerReducer,
  openRightDrawerReducer,
  closeRightDrawerReducer,
];

export const layoutReducers = (state = layoutInitialState, action: LayoutActions): LayoutState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
