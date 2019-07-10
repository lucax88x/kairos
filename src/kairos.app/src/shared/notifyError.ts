import { put, takeLatest } from 'redux-saga/effects';

import { enqueueSnackbarAction } from '../notification-manager/actions';
import { GET_TIME_ENTRIES_ERROR } from './../dashboard/constants';

function* doNotifyError() {
  yield put(enqueueSnackbarAction('s', { variant: 'error' }));
}

export function* notifyError() {
  yield takeLatest([GET_TIME_ENTRIES_ERROR], doNotifyError);
}
