import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_TIME_ABSENCE_ENTRY_DRAWER } from './constants';
import { LayoutState } from './state';

export const openTimeAbsenceEntryDrawerAction = () => action(OPEN_TIME_ABSENCE_ENTRY_DRAWER);

export const openTimeAbsenceEntryDrawerReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_TIME_ABSENCE_ENTRY_DRAWER:
        draft.isTimeAbsenceEntryDrawerOpen = true;
        break;
    }
  });
