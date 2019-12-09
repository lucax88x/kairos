import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { put, select, takeLatest, call } from 'redux-saga/effects';
import { createAsyncAction, PayloadAction, action } from 'typesafe-actions';
import { NavigatorActions } from '../actions';
import { EntryModel } from '../models/entry-list-model';
import { getEntries } from '../services/navigator/navigator.service';
import {
  CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
  CREATE_TIME_ENTRY_SUCCESS,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
  DELETE_TIME_ENTRIES_SUCCESS,
  DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
} from '../shared/constants';
import {
  selectNavigatorRoute,
  selectNavigatorCustomRoute,
} from '../shared/router.selectors';
import { selectIsOnline, selectSelectedYear } from '../shared/selectors';
import {
  GET_ENTRIES,
  GET_ENTRIES_FAILURE,
  GET_ENTRIES_SUCCESS,
  CLEAR_ENTRIES,
} from './constants';
import { NavigatorState } from './state';
import { selectStartDate, selectEndDate } from './selectors';
import { Route } from '../models/route.model';
import { isEqual, startOfDay } from 'date-fns';

export const getEntriesAsync = createAsyncAction(
  GET_ENTRIES,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_FAILURE,
)<void, EntryModel[], string>();

export const clearEntries = () => action(CLEAR_ENTRIES);

function* doGetEntriesOnOtherActions() {
  const navigatorRoute: Route<{ month: number; day: number }> = yield select(
    selectNavigatorRoute,
  );
  const navigatorCustomRoute: Route = yield select(selectNavigatorCustomRoute);
  if (!!navigatorCustomRoute) {
    yield put(getEntriesAsync.request());
  } else if (!!navigatorRoute) {
    const year = yield select(selectSelectedYear);
    const currentStart = yield select(selectStartDate);

    const month = navigatorRoute.params.month - 1;
    const day = navigatorRoute.params.day;

    const date = new Date(year, month, day);

    const start = startOfDay(date);

    // still needs to sync route with filters
    if (isEqual(currentStart, start)) {
      yield put(getEntriesAsync.request());
    } else {
      yield put(clearEntries());
    }
  }
}

function* doGetEntries() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    yield put(getEntriesAsync.failure(''));
    return;
  }

  const start = yield select(selectStartDate);
  const end = yield select(selectEndDate);

  try {
    const entries = yield call(getEntries, start, end);
    yield put(getEntriesAsync.success(entries));
  } catch (error) {
    yield put(getEntriesAsync.failure(error.message));
  }
}

export function* getEntriesSaga() {
  yield takeLatest(
    [
      LOCATION_CHANGE,
      CREATE_TIME_ENTRY_SUCCESS,
      CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
      DELETE_TIME_ENTRIES_SUCCESS,
      DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
      DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
    ],
    doGetEntriesOnOtherActions,
  );

  yield takeLatest(GET_ENTRIES, doGetEntries);
}

export const getEntriesReducer = (
  state: NavigatorState,
  action: NavigatorActions,
): NavigatorState =>
  produce(state, draft => {
    switch (action.type) {
      case CLEAR_ENTRIES:
        draft.entries = [];
        break;
      case GET_ENTRIES:
        draft.ui.busy.getEntries = true;
        draft.entries = [];
        break;
      case GET_ENTRIES_SUCCESS:
        draft.ui.busy.getEntries = false;
        draft.entries = action.payload;
        break;
      case GET_ENTRIES_FAILURE:
        draft.ui.busy.getEntries = false;
        break;
    }
  });
