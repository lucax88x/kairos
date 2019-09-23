import { reduce } from 'ramda';

import { EditTimeHolidayEntryActions } from '../actions';
import { getTimeHolidayEntryReducer } from './get-time-holiday-entry';
import { editTimeHolidayEntryInitialState, EditTimeHolidayEntryState } from './state';
import { updateTimeHolidayEntryReducer } from './update-time-holiday-entry';

const reducers = [getTimeHolidayEntryReducer, updateTimeHolidayEntryReducer];

export const editTimeHolidayEntryReducers = (
  state = editTimeHolidayEntryInitialState,
  action: EditTimeHolidayEntryActions,
): EditTimeHolidayEntryState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
