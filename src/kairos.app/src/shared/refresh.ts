import produce from 'immer';
import { put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { IS_ONLINE } from '../shared/constants';
import { getTimeAbsenceEntriesAsync, getTimeEntriesAsync, getTimeHolidayEntriesAsync } from './actions';
import { REFRESH } from './constants';
import { SharedState } from './state';

export const refreshAction = () => action(REFRESH);

function* doRefreshOnOtherActions() {
  yield put(refreshAction());
}

function* doRefresh() {
  yield put(getTimeEntriesAsync.request());
  yield put(getTimeAbsenceEntriesAsync.request());
  yield put(getTimeHolidayEntriesAsync.request());
}

export function* refreshSaga() {
  yield takeLatest([IS_ONLINE], doRefreshOnOtherActions);
  yield takeLatest(REFRESH, doRefresh);
}

export const refreshReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case REFRESH:
        // draft.ui.busy.refresh = true;
        break;
    }
  });
