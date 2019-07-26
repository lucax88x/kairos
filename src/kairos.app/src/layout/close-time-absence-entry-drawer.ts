import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { CLOSE_TIME_ABSENCE_ENTRY_DRAWER } from './constants';
import { LayoutState } from './state';

export const closeTimeAbsenceEntryDrawerAction = () => action(CLOSE_TIME_ABSENCE_ENTRY_DRAWER);

export const closeTimeAbsenceEntryDrawerReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case CLOSE_TIME_ABSENCE_ENTRY_DRAWER:
        draft.isTimeAbsenceEntryDrawerOpen = false;
        break;
    }
  });
