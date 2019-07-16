import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_RIGHT_DRAWER } from './constants';
import { LayoutState } from './state';

export const openRightDrawerAction = () => action(OPEN_RIGHT_DRAWER);

export const openRightDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_RIGHT_DRAWER:
        draft.isRightDrawerOpen = true;
        break;
    }
  });
