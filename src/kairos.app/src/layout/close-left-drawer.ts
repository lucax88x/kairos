import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { CLOSE_LEFT_DRAWER } from './constants';
import { LayoutState } from './state';

export const closeLeftDrawerAction = () => action(CLOSE_LEFT_DRAWER);

export const closeLeftDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case CLOSE_LEFT_DRAWER:
        draft.isLeftDrawerOpen = false;
        break;
    }
  });
