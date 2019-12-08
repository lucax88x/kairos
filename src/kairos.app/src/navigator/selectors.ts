import { createSelector } from 'reselect';
import { State } from '../state';
import { sort, sortBy } from 'ramda';
import {
  isTimeEntryListModel,
  isTimeAbsenceEntryModel,
  isTimeHolidayEntryModel,
} from '../code/is';
import { getUnixTime } from 'date-fns';

const selectState = (state: State) => state.navigator;

export const selectEntries = createSelector(
  selectState,
  state => state.entries,
);

export const selectSortedEntries = createSelector(selectEntries, entries =>
  sortBy(e => {
    if (isTimeEntryListModel(e)) {
      return getUnixTime(e.when);
    } else if (isTimeAbsenceEntryModel(e)) {
      return getUnixTime(e.start);
    } else if (isTimeHolidayEntryModel(e)) {
      return getUnixTime(e.when);
    }
    return 0;
  }, entries),
);

export const selectStartDate = createSelector(
  selectState,
  state => state.startDate,
);

export const selectEndDate = createSelector(
  selectState,
  state => state.endDate,
);

export const selectUi = createSelector(selectState, state => state.ui);

export const selectBusy = createSelector(selectUi, ui => ui.busy);

export const selectIsGetEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getEntries,
);
