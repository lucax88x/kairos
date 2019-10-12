import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { ExportActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeEntryModel } from '../models/time-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { exportTimeEntries } from '../services/time-entry/time-entry.service';
import {
  EXPORT_TIME_ENTRIES,
  EXPORT_TIME_ENTRIES_FAILURE,
  EXPORT_TIME_ENTRIES_SUCCESS,
} from './constants';
import { ExportState } from './state';

export const exportTimeEntriesAsync = createAsyncAction(
  EXPORT_TIME_ENTRIES,
  EXPORT_TIME_ENTRIES_SUCCESS,
  EXPORT_TIME_ENTRIES_FAILURE,
)<{ start: Date, end: Date }, void, string>();

function* doExportTimeEntries({
  payload: { start, end },
}: ReturnType<typeof exportTimeEntriesAsync.request>) {
  try {
    yield call(exportTimeEntries, start, end);

    yield put(exportTimeEntriesAsync.success());
  } catch (error) {
    yield put(exportTimeEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.ExportEntriesSaved`), { variant: 'success' }));
}

export function* exportTimeEntriesSaga() {
  yield takeLatest(EXPORT_TIME_ENTRIES, doExportTimeEntries);
  yield takeLatest(EXPORT_TIME_ENTRIES_SUCCESS, doNotifySuccess);
}

export const exportTimeEntriesReducer = (
  state: ExportState,
  action: ExportActions,
): ExportState =>
  produce(state, draft => {
    switch (action.type) {
      case EXPORT_TIME_ENTRIES:
        draft.ui.busy.exportTimeEntries = true;
        break;
      case EXPORT_TIME_ENTRIES_SUCCESS:
        draft.ui.busy.exportTimeEntries = false;
        break;
      case EXPORT_TIME_ENTRIES_FAILURE:
        draft.ui.busy.exportTimeEntries = false;
        break;
    }
  });
