import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { EditTimeEntryActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { updateTimeEntry } from '../services/time-entry/time-entry.service';
import {
  UPDATE_TIME_ENTRY,
  UPDATE_TIME_ENTRY_FAILURE,
  UPDATE_TIME_ENTRY_SUCCESS,
} from './constants';
import { EditTimeEntryState } from './state';

export const updateTimeEntryAsync = createAsyncAction(
  UPDATE_TIME_ENTRY,
  UPDATE_TIME_ENTRY_SUCCESS,
  UPDATE_TIME_ENTRY_FAILURE,
)<{ model: TimeEntryModel }, void, string>();

function* doUpdateTimeEntry({
  payload: { model },
}: ReturnType<typeof updateTimeEntryAsync.request>) {
  try {
    yield call(updateTimeEntry, model);

    yield put(updateTimeEntryAsync.success());
  } catch (error) {
    yield put(updateTimeEntryAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(
    enqueueSnackbarAction(i18n._(t`Entry Updated`), { variant: 'success' }),
  );
}

export function* updateTimeEntrySaga() {
  yield takeLatest(UPDATE_TIME_ENTRY, doUpdateTimeEntry);
  yield takeLatest(UPDATE_TIME_ENTRY_SUCCESS, doNotifySuccess);
}

export const updateTimeEntryReducer = (
  state: EditTimeEntryState,
  action: EditTimeEntryActions,
): EditTimeEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_TIME_ENTRY:
        if (action.payload.model.type === TimeEntryTypes.IN) {
          draft.ui.busy.updateTimeEntryAsIn = true;
        } else if (action.payload.model.type === TimeEntryTypes.OUT) {
          draft.ui.busy.updateTimeEntryAsOut = true;
        }
        break;
      case UPDATE_TIME_ENTRY_SUCCESS:
        draft.ui.busy.updateTimeEntryAsIn = false;
        draft.ui.busy.updateTimeEntryAsOut = false;
        break;
      case UPDATE_TIME_ENTRY_FAILURE:
        draft.ui.busy.updateTimeEntryAsIn = false;
        draft.ui.busy.updateTimeEntryAsOut = false;
        break;
    }
  });
