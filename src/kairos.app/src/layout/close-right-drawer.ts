import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { CLOSE_RIGHT_DRAWER } from './constants';
import { LayoutState } from './state';

export const closeRightDrawerAction = () => action(CLOSE_RIGHT_DRAWER);

export const closeRightDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case CLOSE_RIGHT_DRAWER:
        draft.isRightDrawerOpen = false;
        break;
    }
  });
