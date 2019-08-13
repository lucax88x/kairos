import { produce } from 'immer';
import { put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { LayoutActions } from '../actions';
import { CREATE_TIME_HOLIDAY_ENTRY_SUCCESS } from '../shared/constants';
import { CLOSE_TIME_HOLIDAY_ENTRY_MODAL } from './constants';
import { LayoutState } from './state';

export const closeTimeHolidayEntryModalAction = () => action(CLOSE_TIME_HOLIDAY_ENTRY_MODAL);

function* doCloseModal() {
  yield put(closeTimeHolidayEntryModalAction());
}

export function* createTimeEntrySaga() {
  yield takeLatest(CREATE_TIME_HOLIDAY_ENTRY_SUCCESS, doCloseModal);
}

export const closeTimeHolidayEntryModalReducer = (
  state: LayoutState,
  action: LayoutActions,
): LayoutState =>
  produce(state, draft => {
    switch (action.type) {
      case CLOSE_TIME_HOLIDAY_ENTRY_MODAL:
        draft.isTimeHolidayEntryModalOpen = false;
        break;
    }
  });
