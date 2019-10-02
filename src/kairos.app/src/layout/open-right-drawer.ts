import { produce } from 'immer';
import { put, select, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { LayoutActions } from '../actions';
import { closeLeftDrawerAction } from './actions';
import { OPEN_RIGHT_DRAWER } from './constants';
import { selectIsLeftDrawerOpen } from './selectors';
import { LayoutState } from './state';

export const openRightDrawerAction = () => action(OPEN_RIGHT_DRAWER);

function* closeLeftDrawerIfOpen() {
  const isLeftDraweOpen: boolean = yield select(selectIsLeftDrawerOpen);

  if (isLeftDraweOpen) {
    yield put(closeLeftDrawerAction());
  }
}

export function* openRightDrawerSaga() {
  yield takeLatest(OPEN_RIGHT_DRAWER, closeLeftDrawerIfOpen);
}

export const openRightDrawerReducer = (state: LayoutState, action: LayoutActions): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_RIGHT_DRAWER:
        draft.isRightDrawerOpen = true;
        break;
    }
  });
