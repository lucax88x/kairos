import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { EditTimeAbsenceEntryActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/enqueue-snackbar';
import { updateTimeAbsenceEntry } from '../services/time-absence-entry/time-absence-entry.service';
import { UPDATE_TIME_ABSENCE_ENTRY, UPDATE_TIME_ABSENCE_ENTRY_FAILURE, UPDATE_TIME_ABSENCE_ENTRY_SUCCESS } from './constants';
import { EditTimeAbsenceEntryState } from './state';


export const updateTimeAbsenceEntryAsync = createAsyncAction(
  UPDATE_TIME_ABSENCE_ENTRY,
  UPDATE_TIME_ABSENCE_ENTRY_SUCCESS,
  UPDATE_TIME_ABSENCE_ENTRY_FAILURE,
)<{ model: TimeAbsenceEntryModel }, void, string>();

function* doDeleteTimeAbsenceEntry({
  payload: { model },
}: ReturnType<typeof updateTimeAbsenceEntryAsync.request>) {
  try {
    yield call(updateTimeAbsenceEntry, model);

    yield put(updateTimeAbsenceEntryAsync.success());
  } catch (error) {
    yield put(updateTimeAbsenceEntryAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.AbsenceUpdated`), { variant: 'success' }));
}

export function* updateTimeAbsenceEntrySaga() {
  yield takeLatest(UPDATE_TIME_ABSENCE_ENTRY, doDeleteTimeAbsenceEntry);
  yield takeLatest(UPDATE_TIME_ABSENCE_ENTRY_SUCCESS, doNotifySuccess);
}

export const updateTimeAbsenceEntryReducer = (
  state: EditTimeAbsenceEntryState,
  action: EditTimeAbsenceEntryActions,
): EditTimeAbsenceEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_TIME_ABSENCE_ENTRY:
        draft.ui.busy.updateTimeAbsenceEntry = true;
        break;
      case UPDATE_TIME_ABSENCE_ENTRY_SUCCESS:
        draft.ui.busy.updateTimeAbsenceEntry = false;
        break;
      case UPDATE_TIME_ABSENCE_ENTRY_FAILURE:
        draft.ui.busy.updateTimeAbsenceEntry = false;
        break;
    }
  });
