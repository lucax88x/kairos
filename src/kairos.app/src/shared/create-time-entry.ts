import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { createTimeEntry } from '../services/time-entry/time-entry.service';
import { CREATE_TIME_ENTRY, CREATE_TIME_ENTRY_ERROR, CREATE_TIME_ENTRY_SUCCESS } from './constants';
import { UUID } from '../models/uuid.model';
import { TimeEntryTypes } from '../models/time-entry.model';

export const createTimeEntryAction = () => action(CREATE_TIME_ENTRY);
export const createTimeEntrySuccessAction = () => action(CREATE_TIME_ENTRY_SUCCESS);
export const createTimeEntryErrorAction = (error: string) => action(CREATE_TIME_ENTRY_ERROR, error);

function* doCreateTimeEntry() {
  try {
    yield call(createTimeEntry, {
      id: UUID.Generate(),
      type: TimeEntryTypes.IN,
      when: new Date(),
    });

    yield put(createTimeEntrySuccessAction());
  } catch (error) {
    yield put(createTimeEntryErrorAction(error.message));
  }
}

export function* createTimeEntrySaga() {
  yield takeLatest(CREATE_TIME_ENTRY, doCreateTimeEntry);
}
