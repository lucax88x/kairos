import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action, createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { i18n } from '../i18nLoader';
import { UUID } from '../models/uuid.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { deleteTimeAbsenceEntries } from '../services/time-absence-entry/time-absence-entry.service';
import { askForConfirmation } from './ask-for-confirmation';
import {
  DELETE_TIME_ABSENCE_ENTRIES,
  DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
  TRY_DELETE_TIME_ABSENCE_ENTRIES,
} from './constants';
import { SharedState } from './state';

export const tryDeleteTimeAbsenceEntriesAction = (ids: UUID[]) =>
  action(TRY_DELETE_TIME_ABSENCE_ENTRIES, ids);

export const deleteTimeAbsenceEntriesAsync = createAsyncAction(
  DELETE_TIME_ABSENCE_ENTRIES,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
  DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
)<void, void, string>();

function* doDeleteTimeAbsenceEntries({
  payload,
}: ReturnType<typeof tryDeleteTimeAbsenceEntriesAction>) {
  const confirmed = yield call(askForConfirmation, {
    title: null,
    message: i18n._(t`ConfirmationModal.DeleteAbsences`),
    rejectButton: null,
    approveButton: null,
  });

  if (!confirmed) {
    return;
  }

  try {
    yield put(deleteTimeAbsenceEntriesAsync.request());

    yield call(deleteTimeAbsenceEntries, payload);

    yield put(deleteTimeAbsenceEntriesAsync.success());
  } catch (error) {
    yield put(deleteTimeAbsenceEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(
    enqueueSnackbarAction(i18n._(t`Messages.AbsenceDeleted`), {
      variant: 'success',
    }),
  );
}

export function* deleteTimeAbsenceEntriesSaga() {
  yield takeLatest(TRY_DELETE_TIME_ABSENCE_ENTRIES, doDeleteTimeAbsenceEntries);
  yield takeLatest(DELETE_TIME_ABSENCE_ENTRIES_SUCCESS, doNotifySuccess);
}

export const deleteTimeAbsenceEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_ABSENCE_ENTRIES:
        draft.ui.busy.deleteTimeAbsenceEntries = true;
        break;
      case DELETE_TIME_ABSENCE_ENTRIES_SUCCESS:
        draft.ui.busy.deleteTimeAbsenceEntries = false;
        break;
      case DELETE_TIME_ABSENCE_ENTRIES_FAILURE:
        draft.ui.busy.deleteTimeAbsenceEntries = false;
        break;
    }
  });
