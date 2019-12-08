import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { Route } from 'react-router';
import { put, select, takeLatest, call } from 'redux-saga/effects';
import { createAsyncAction, PayloadAction } from 'typesafe-actions';
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
import { selectNavigatorRoute } from '../shared/router.selectors';
import { selectIsOnline } from '../shared/selectors';
import {
  GET_ENTRIES,
  GET_ENTRIES_FAILURE,
  GET_ENTRIES_SUCCESS,
} from './constants';
import { NavigatorState } from './state';
import { selectStartDate, selectEndDate } from './selectors';

export const getEntriesAsync = createAsyncAction(
  GET_ENTRIES,
  GET_ENTRIES_SUCCESS,
  GET_ENTRIES_FAILURE,
)<void, EntryModel[], string>();

function* doGetEntriesOnOtherActions() {
  const navigatorRoute: Route = yield select(selectNavigatorRoute);
  if (!!navigatorRoute) {
    yield put(getEntriesAsync.request());
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
