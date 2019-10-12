import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { UUID } from '../models/uuid.model';
import { deleteTimeEntries } from '../services/time-entry/time-entry.service';
import { DELETE_TIME_ENTRIES, DELETE_TIME_ENTRIES_FAILURE, DELETE_TIME_ENTRIES_SUCCESS } from './constants';
import { SharedState } from './state';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { i18n } from '../i18nLoader';
import { t } from '@lingui/macro';


export const deleteTimeEntriesAsync = createAsyncAction(
  DELETE_TIME_ENTRIES,
  DELETE_TIME_ENTRIES_SUCCESS,
  DELETE_TIME_ENTRIES_FAILURE,
)<{ ids: UUID[] }, void, string>();

function* doDeleteTimeEntries({ payload: { ids } }: ReturnType<typeof deleteTimeEntriesAsync.request>) {
  try {
    yield call(deleteTimeEntries, ids);

    yield put(deleteTimeEntriesAsync.success());
  } catch (error) {
    yield put(deleteTimeEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.EntryDeleted`), { variant: 'success' }));
}

export function* deleteTimeEntriesSaga() {
  yield takeLatest(DELETE_TIME_ENTRIES, doDeleteTimeEntries);
  yield takeLatest(DELETE_TIME_ENTRIES_SUCCESS, doNotifySuccess);
}

export const deleteTimeEntriesReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_ENTRIES:
        draft.ui.busy.deleteTimeEntries = true;
        break;
      case DELETE_TIME_ENTRIES_SUCCESS:
        draft.ui.busy.deleteTimeEntries = false;
        break;
      case DELETE_TIME_ENTRIES_FAILURE:
        draft.ui.busy.deleteTimeEntries = false;
        break;
    }
  });
