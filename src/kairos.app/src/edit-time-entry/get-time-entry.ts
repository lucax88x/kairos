import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { EditTimeEntryActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeEntryModel } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { getTimeEntry } from '../services/time-entry/time-entry.service';
import { selectEditTimeEntryRoute } from '../shared/router.selectors';
import { GET_TIME_ENTRY, GET_TIME_ENTRY_FAILURE, GET_TIME_ENTRY_SUCCESS } from './constants';
import { EditTimeEntryState } from './state';

export const getTimeEntryAsync = createAsyncAction(
  GET_TIME_ENTRY,
  GET_TIME_ENTRY_SUCCESS,
  GET_TIME_ENTRY_FAILURE,
)<UUID, TimeEntryModel, string>();

function* doGetTimeEntryOnOtherActions() {
  const route: Route<{ id: UUID }> = yield select(selectEditTimeEntryRoute);

  if (!!route) {
    yield put(getTimeEntryAsync.request(route.params.id));
  }
}

function* doGetTimeEntry({ payload }: ReturnType<typeof getTimeEntryAsync.request>) {
  try {
    const timeEntry = yield call(getTimeEntry, payload);

    yield put(getTimeEntryAsync.success(timeEntry));
  } catch (error) {
    yield put(getTimeEntryAsync.failure(error.message));
  }
}

export function* getTimeEntrySaga() {
  yield takeLatest(LOCATION_CHANGE, doGetTimeEntryOnOtherActions);
  yield takeLatest(GET_TIME_ENTRY, doGetTimeEntry);
}

export const getTimeEntryReducer = (
  state: EditTimeEntryState,
  action: EditTimeEntryActions,
): EditTimeEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ENTRY:
        draft.ui.busy.getTimeEntry = true;
        draft.timeEntry = TimeEntryModel.empty;
        break;
      case GET_TIME_ENTRY_SUCCESS:
        draft.ui.busy.getTimeEntry = false;
        draft.timeEntry = action.payload;
        break;
      case GET_TIME_ENTRY_FAILURE:
        draft.ui.busy.getTimeEntry = false;
        break;
    }
  });
