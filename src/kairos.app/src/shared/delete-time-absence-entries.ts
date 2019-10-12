import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { deleteTimeAbsenceEntries } from '../services/time-absence-entry/time-absence-entry.service';
import {
  DELETE_TIME_ABSENCE_ENTRIES,
  DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
} from './constants';
import { SharedState } from './state';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { i18n } from '../i18nLoader';
import { t } from '@lingui/macro';
import { UUID } from '../models/uuid.model';

export const deleteTimeAbsenceEntriesAsync = createAsyncAction(
  DELETE_TIME_ABSENCE_ENTRIES,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
  DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
)<{ ids: UUID[] }, void, string>();

function* doDeleteTimeAbsenceEntries({
  payload: { ids },
}: ReturnType<typeof deleteTimeAbsenceEntriesAsync.request>) {
  try {
    yield call(deleteTimeAbsenceEntries, ids);

    yield put(deleteTimeAbsenceEntriesAsync.success());
  } catch (error) {
    yield put(deleteTimeAbsenceEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.AbsenceDeleted`), { variant: 'success' }));
}

export function* deleteTimeAbsenceEntriesSaga() {
  yield takeLatest(DELETE_TIME_ABSENCE_ENTRIES, doDeleteTimeAbsenceEntries);
  yield takeLatest(DELETE_TIME_ABSENCE_ENTRIES_SUCCESS, doNotifySuccess);
}

export const deleteTimeAbsenceEntriesReducer = (state: SharedState, action: SharedActions): SharedState =>
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
