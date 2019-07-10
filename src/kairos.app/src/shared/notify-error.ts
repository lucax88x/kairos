import { put, takeLatest } from 'redux-saga/effects';

import { enqueueSnackbarAction } from '../notification-manager/actions';
import { GET_TIME_ENTRIES_ERROR } from './../dashboard/constants';
import { CREATE_TIME_ENTRY_ERROR } from './constants';
import { PayloadAction } from 'typesafe-actions';

function* doNotifyError(action: PayloadAction<string, string>) {
  yield put(enqueueSnackbarAction(action.payload, { variant: 'error' }));
}

export function* notifyError() {
  yield takeLatest([GET_TIME_ENTRIES_ERROR, CREATE_TIME_ENTRY_ERROR], doNotifyError);
}
