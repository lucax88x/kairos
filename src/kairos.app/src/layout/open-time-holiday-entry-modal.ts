import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_TIME_HOLIDAY_ENTRY_MODAL } from './constants';
import { LayoutState } from './state';

export const openTimeHolidayEntryModalAction = () => action(OPEN_TIME_HOLIDAY_ENTRY_MODAL);

export const openTimeHolidayEntryModalReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_TIME_HOLIDAY_ENTRY_MODAL:
        draft.isTimeHolidayEntryModalOpen = true;
        break;
    }
  });
