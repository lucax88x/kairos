import { LOCATION_CHANGE } from 'connected-react-router';
import { produce } from 'immer';
import { put, select, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { LayoutActions } from '../actions';
import { closeRightDrawerAction } from './actions';
import { closeTimeEntryDrawerAction } from './close-time-entry-drawer';
import { OPEN_TIME_ENTRY_DRAWER } from './constants';
import {
  selectIsRightDrawerOpen,
  selectIsTimeEntryDrawerOpen,
} from './selectors';
import { LayoutState } from './state';

export const openTimeEntryDrawerAction = () => action(OPEN_TIME_ENTRY_DRAWER);

function* closeRightDrawerIfOpen() {
  const isRightDrawerOpen: boolean = yield select(selectIsRightDrawerOpen);

  if (isRightDrawerOpen) {
    yield put(closeRightDrawerAction());
  }
}

function* closeTimeEntryDrawerIfOpen() {
  const isTimeEntryDrawerOpen: boolean = yield select(
    selectIsTimeEntryDrawerOpen,
  );

  if (isTimeEntryDrawerOpen) {
    yield put(closeTimeEntryDrawerAction());
  }
}

export function* openTimeEntryDrawerSaga() {
  yield takeLatest(LOCATION_CHANGE, closeTimeEntryDrawerIfOpen);
  yield takeLatest(OPEN_TIME_ENTRY_DRAWER, closeRightDrawerIfOpen);
}

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
