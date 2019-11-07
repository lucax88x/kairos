import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { OPEN_LEFT_DRAWER } from './constants';
import { LayoutState } from './state';
import { takeLatest, select, put } from 'redux-saga/effects';
import { selectIsRightDrawerOpen, selectIsLeftDrawerOpen } from './selectors';
import { closeRightDrawerAction } from './close-right-drawer';
import { closeLeftDrawerAction } from './close-left-drawer';
import { LOCATION_CHANGE } from 'connected-react-router';

export const openLeftDrawerAction = () => action(OPEN_LEFT_DRAWER);

function* closeLeftDrawerIfOpen() {
  const isLeftDrawerOpen: boolean = yield select(selectIsLeftDrawerOpen);

  if (isLeftDrawerOpen) {
    yield put(closeLeftDrawerAction());
  }
}

function* closeRightDrawerIfOpen() {
  const isRightDrawerOpen: boolean = yield select(selectIsRightDrawerOpen);

  if (isRightDrawerOpen) {
    yield put(closeRightDrawerAction());
  }
}

export function* openLeftDrawerSaga() {
  yield takeLatest(LOCATION_CHANGE, closeLeftDrawerIfOpen);
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
