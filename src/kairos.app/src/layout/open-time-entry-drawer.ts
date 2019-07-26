import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_TIME_ENTRY_DRAWER } from './constants';
import { LayoutState } from './state';

export const openTimeEntryDrawerAction = () => action(OPEN_TIME_ENTRY_DRAWER);

export const openTimeEntryDrawerReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_TIME_ENTRY_DRAWER:
        draft.isTimeEntryDrawerOpen = true;
        break;
    }
  });
