import { put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { GET_ENTRIES_FAILURE } from './constants';

function* doNotifyError(action: PayloadAction<string, string>) {
  if (!!action.payload) {
    yield put(
      enqueueSnackbarAction(action.payload.toString(), { variant: 'error' }),
    );
  }
}

export function* notifyError() {
  yield takeLatest([GET_ENTRIES_FAILURE], doNotifyError);
}
