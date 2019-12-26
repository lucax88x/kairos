import { produce } from 'immer';
import { put, select, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { LayoutActions } from '../actions';
import { closeLeftDrawerAction, closeRightDrawerAction } from './actions';
import { OPEN_RIGHT_DRAWER } from './constants';
import { selectIsLeftDrawerOpen, selectIsRightDrawerOpen } from './selectors';
import { LayoutState } from './state';
import { LOCATION_CHANGE } from 'connected-react-router';

export const openRightDrawerAction = () => action(OPEN_RIGHT_DRAWER);

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

export function* openRightDrawerSaga() {
  yield takeLatest(LOCATION_CHANGE, closeRightDrawerIfOpen);
  yield takeLatest(OPEN_RIGHT_DRAWER, closeLeftDrawerIfOpen);
}

export const openRightDrawerReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_RIGHT_DRAWER:
        draft.isRightDrawerOpen = true;
        break;
    }
  });
