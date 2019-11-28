import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action, createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { i18n } from '../i18nLoader';
import { UUID } from '../models/uuid.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { deleteTimeEntries } from '../services/time-entry/time-entry.service';
import { askForConfirmation } from './ask-for-confirmation';
import {
  DELETE_TIME_ENTRIES,
  DELETE_TIME_ENTRIES_FAILURE,
  DELETE_TIME_ENTRIES_SUCCESS,
  TRY_DELETE_TIME_ENTRIES,
} from './constants';
import { SharedState } from './state';

export const tryDeleteTimeEntriesAction = (ids: UUID[]) =>
  action(TRY_DELETE_TIME_ENTRIES, ids);

export const deleteTimeEntriesAsync = createAsyncAction(
  DELETE_TIME_ENTRIES,
  DELETE_TIME_ENTRIES_SUCCESS,
  DELETE_TIME_ENTRIES_FAILURE,
)<void, void, string>();

function* doTryDeleteTimeEntries({
  payload,
}: ReturnType<typeof tryDeleteTimeEntriesAction>) {
  const confirmed = yield call(askForConfirmation, {
    title: null,
    message: i18n._(t`Are you sure you want to delete the selected entries?`),
    rejectButton: null,
    approveButton: null,
  });

  if (!confirmed) {
    return;
  }

  try {
    yield put(deleteTimeEntriesAsync.request());

    yield call(deleteTimeEntries, payload);

    yield put(deleteTimeEntriesAsync.success());
  } catch (error) {
    yield put(deleteTimeEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(
    enqueueSnackbarAction(i18n._(t`Entry Deleted`), {
      variant: 'success',
    }),
  );
}

export function* deleteTimeEntriesSaga() {
  yield takeLatest(TRY_DELETE_TIME_ENTRIES, doTryDeleteTimeEntries);
  yield takeLatest(DELETE_TIME_ENTRIES_SUCCESS, doNotifySuccess);
}

export const deleteTimeEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
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
