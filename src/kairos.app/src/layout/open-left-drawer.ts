import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_LEFT_DRAWER } from './constants';
import { LayoutState } from './state';
import { takeLatest, select, put } from 'redux-saga/effects';
import { selectIsRightDrawerOpen } from './selectors';
import { closeRightDrawerAction } from './close-right-drawer';

export const openLeftDrawerAction = () => action(OPEN_LEFT_DRAWER);

function* closeRightDrawerIfOpen() {
  const isRightDraweOpen: boolean = yield select(selectIsRightDrawerOpen);

  if (isRightDraweOpen) {
    yield put(closeRightDrawerAction());
  }
}

export function* openLeftDrawerSaga() {
  yield takeLatest(OPEN_LEFT_DRAWER, closeRightDrawerIfOpen);
}

export const openLeftDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_LEFT_DRAWER:
        draft.isLeftDrawerOpen = true;
        break;
    }
  });
