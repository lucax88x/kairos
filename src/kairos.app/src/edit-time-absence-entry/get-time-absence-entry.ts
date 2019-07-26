import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { EditTimeAbsenceEntryActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';
import { getTimeAbsenceEntry } from '../services/time-absence-entry/time-absence-entry.service';
import { selectEditTimeAbsenceEntryRoute } from '../shared/router.selectors';
import { GET_TIME_ABSENCE_ENTRY, GET_TIME_ABSENCE_ENTRY_FAILURE, GET_TIME_ABSENCE_ENTRY_SUCCESS } from './constants';
import { EditTimeAbsenceEntryState } from './state';

export const getTimeAbsenceEntryAsync = createAsyncAction(
  GET_TIME_ABSENCE_ENTRY,
  GET_TIME_ABSENCE_ENTRY_SUCCESS,
  GET_TIME_ABSENCE_ENTRY_FAILURE,
)<UUID, TimeAbsenceEntryModel, string>();

function* doGetTimeAbsenceEntryOnOtherActions() {
  const route: Route<{ id: UUID }> = yield select(selectEditTimeAbsenceEntryRoute);

  if (!!route) {
    yield put(getTimeAbsenceEntryAsync.request(route.params.id));
  }
}

function* doGetTimeAbsenceEntry({ payload }: ReturnType<typeof getTimeAbsenceEntryAsync.request>) {
  try {
    const timeAbsenceEntry = yield call(getTimeAbsenceEntry, payload);

    yield put(getTimeAbsenceEntryAsync.success(timeAbsenceEntry));
  } catch (error) {
    yield put(getTimeAbsenceEntryAsync.failure(error.message));
  }
}

export function* getTimeAbsenceEntrySaga() {
  yield takeLatest(LOCATION_CHANGE, doGetTimeAbsenceEntryOnOtherActions);
  yield takeLatest(GET_TIME_ABSENCE_ENTRY, doGetTimeAbsenceEntry);
}

export const getTimeAbsenceEntryReducer = (
  state: EditTimeAbsenceEntryState,
  action: EditTimeAbsenceEntryActions,
): EditTimeAbsenceEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ABSENCE_ENTRY:
        draft.ui.busy.getTimeAbsenceEntry = true;
        draft.timeAbsenceEntry = TimeAbsenceEntryModel.empty;
        break;
      case GET_TIME_ABSENCE_ENTRY_SUCCESS:
        draft.ui.busy.getTimeAbsenceEntry = false;
        draft.timeAbsenceEntry = action.payload;
        break;
      case GET_TIME_ABSENCE_ENTRY_FAILURE:
        draft.ui.busy.getTimeAbsenceEntry = false;
        break;
    }
  });
