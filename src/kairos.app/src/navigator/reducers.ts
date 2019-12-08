import { reduce } from 'ramda';
import { NavigatorActions } from '../actions';
import { getEntriesReducer } from './get-entries';
import { setNavigatorFiltersReducer } from './set-navigator-filters';
import { navigatorInitialState, NavigatorState } from './state';

const reducers = [getEntriesReducer, setNavigatorFiltersReducer];

export const navigatorReducers = (
  state = navigatorInitialState,
  action: NavigatorActions,
): NavigatorState =>
  reduce(
    (updatingState, reducer) => reducer(updatingState, action),
    state,
    reducers,
  );
