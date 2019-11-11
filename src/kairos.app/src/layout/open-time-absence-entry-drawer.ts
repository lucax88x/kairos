import { produce } from 'immer';
import { put, select, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { LayoutActions } from '../actions';
import { closeRightDrawerAction } from './actions';
import { OPEN_TIME_ABSENCE_ENTRY_DRAWER } from './constants';
import { selectIsRightDrawerOpen } from './selectors';
import { LayoutState } from './state';

export const openTimeAbsenceEntryDrawerAction = () => action(OPEN_TIME_ABSENCE_ENTRY_DRAWER);

function* closeRightDrawerIfOpen() {
  const isRightDrawerOpen: boolean = yield select(selectIsRightDrawerOpen);

  if (isRightDrawerOpen) {
    yield put(closeRightDrawerAction());
  }
}

export function* openTimeAbsenceEntryDrawerSaga() {
  yield takeLatest(OPEN_TIME_ABSENCE_ENTRY_DRAWER, closeRightDrawerIfOpen);
}

export const openTimeAbsenceEntryDrawerReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_TIME_ABSENCE_ENTRY_DRAWER:
        draft.isTimeAbsenceEntryDrawerOpen = true;
        break;
    }
  });
