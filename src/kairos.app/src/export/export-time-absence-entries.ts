import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { ExportActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { exportTimeAbsenceEntries } from '../services/time-absence-entry/time-absence-entry.service';
import { EXPORT_TIME_ABSENCE_ENTRIES, EXPORT_TIME_ABSENCE_ENTRIES_FAILURE, EXPORT_TIME_ABSENCE_ENTRIES_SUCCESS } from './constants';
import { ExportState } from './state';

export const exportTimeAbsenceEntriesAsync = createAsyncAction(
  EXPORT_TIME_ABSENCE_ENTRIES,
  EXPORT_TIME_ABSENCE_ENTRIES_SUCCESS,
  EXPORT_TIME_ABSENCE_ENTRIES_FAILURE,
)<{ models: TimeAbsenceEntryModel[] }, void, string>();

function* doExportTimeAbsenceEntries({
  payload: { models },
}: ReturnType<typeof exportTimeAbsenceEntriesAsync.request>) {
  try {
    yield call(exportTimeAbsenceEntries, models);

    yield put(exportTimeAbsenceEntriesAsync.success());
  } catch (error) {
    yield put(exportTimeAbsenceEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.ExportAbsencesSaved`), { variant: 'success' }));
}

export function* exportTimeAbsenceEntriesSaga() {
  yield takeLatest(EXPORT_TIME_ABSENCE_ENTRIES, doExportTimeAbsenceEntries);
  yield takeLatest(EXPORT_TIME_ABSENCE_ENTRIES_SUCCESS, doNotifySuccess);
}

export const exportTimeAbsenceEntriesReducer = (
  state: ExportState,
  action: ExportActions,
): ExportState =>
  produce(state, draft => {
    switch (action.type) {
      case EXPORT_TIME_ABSENCE_ENTRIES:
        draft.ui.busy.exportTimeAbsenceEntries = true;
        break;
      case EXPORT_TIME_ABSENCE_ENTRIES_SUCCESS:
        draft.ui.busy.exportTimeAbsenceEntries = false;
        break;
      case EXPORT_TIME_ABSENCE_ENTRIES_FAILURE:
        draft.ui.busy.exportTimeAbsenceEntries = false;
        break;
    }
  });
