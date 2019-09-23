import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { EditTimeHolidayEntryActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { getTimeHolidayEntry } from '../services/time-holiday-entry/time-holiday-entry.service';
import { selectEditTimeHolidayEntryRoute } from '../shared/router.selectors';
import { GET_TIME_HOLIDAY_ENTRY, GET_TIME_HOLIDAY_ENTRY_FAILURE, GET_TIME_HOLIDAY_ENTRY_SUCCESS } from './constants';
import { EditTimeHolidayEntryState } from './state';

export const getTimeHolidayEntryAsync = createAsyncAction(
  GET_TIME_HOLIDAY_ENTRY,
  GET_TIME_HOLIDAY_ENTRY_SUCCESS,
  GET_TIME_HOLIDAY_ENTRY_FAILURE,
)<UUID, TimeHolidayEntryModel, string>();

function* doGetTimeHolidayEntryOnOtherActions() {
  const route: Route<{ id: UUID }> = yield select(selectEditTimeHolidayEntryRoute);

  if (!!route) {
    yield put(getTimeHolidayEntryAsync.request(route.params.id));
  }
}

function* doGetTimeHolidayEntry({ payload }: ReturnType<typeof getTimeHolidayEntryAsync.request>) {
  try {
    const timeHolidayEntry = yield call(getTimeHolidayEntry, payload);

    yield put(getTimeHolidayEntryAsync.success(timeHolidayEntry));
  } catch (error) {
    yield put(getTimeHolidayEntryAsync.failure(error.message));
  }
}

export function* getTimeHolidayEntrySaga() {
  yield takeLatest(LOCATION_CHANGE, doGetTimeHolidayEntryOnOtherActions);
  yield takeLatest(GET_TIME_HOLIDAY_ENTRY, doGetTimeHolidayEntry);
}

export const getTimeHolidayEntryReducer = (
  state: EditTimeHolidayEntryState,
  action: EditTimeHolidayEntryActions,
): EditTimeHolidayEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_HOLIDAY_ENTRY:
        draft.ui.busy.getTimeHolidayEntry = true;
        draft.timeHolidayEntry = TimeHolidayEntryModel.empty;
        break;
      case GET_TIME_HOLIDAY_ENTRY_SUCCESS:
        draft.ui.busy.getTimeHolidayEntry = false;
        draft.timeHolidayEntry = action.payload;
        break;
      case GET_TIME_HOLIDAY_ENTRY_FAILURE:
        draft.ui.busy.getTimeHolidayEntry = false;
        break;
    }
  });
