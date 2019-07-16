import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_LEFT_DRAWER } from './constants';
import { LayoutState } from './state';

export const openLeftDrawerAction = () => action(OPEN_LEFT_DRAWER);

export const openLeftDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_LEFT_DRAWER:
        draft.isLeftDrawerOpen = true;
        break;
    }
  });
