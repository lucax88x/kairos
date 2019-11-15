import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { Route } from 'react-router';
import { put, select, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { IS_ONLINE, SELECT_YEAR } from '../shared/constants';
import {
  getTimeAbsenceEntriesAsync,
  getTimeEntriesAsync,
  getTimeHolidayEntriesAsync,
} from './actions';
import { REFRESH } from './constants';
import { selectDashboardRoute } from './router.selectors';
import { selectIsOnline } from './selectors';
import { SharedState } from './state';

export const refreshAction = () => action(REFRESH);

function* doRefreshOnOtherActions() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    return;
  }

  const dashboardRoute: Route = yield select(selectDashboardRoute);

  if (!!dashboardRoute) {
    yield put(refreshAction());
  }
}

function* doRefresh() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    return;
  }

  yield put(getTimeEntriesAsync.request());
  yield put(getTimeAbsenceEntriesAsync.request());
  yield put(getTimeHolidayEntriesAsync.request());
}

export function* refreshSaga() {
  yield takeLatest(
    [LOCATION_CHANGE, IS_ONLINE, SELECT_YEAR],
    doRefreshOnOtherActions,
  );
  yield takeLatest(REFRESH, doRefresh);
}

export const refreshReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case REFRESH:
        draft.refreshDate = new Date();
        break;
    }
  });
