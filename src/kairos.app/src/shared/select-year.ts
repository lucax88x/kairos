import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { SELECT_YEAR } from './constants';
import { SharedState } from './state';

export const selectYear = (year: number) => action(SELECT_YEAR, year);

export const selectYearReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case SELECT_YEAR:
        draft.selectedYear = action.payload;
        break;
    }
  });
