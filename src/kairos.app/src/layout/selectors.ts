import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.layout;

export const selectIsLeftDrawerOpen = createSelector(
  selectState,
  state => state.isLeftDrawerOpen,
);

export const selectIsRightDrawerOpen = createSelector(
  selectState,
  state => state.isRightDrawerOpen,
);

export const selectIsTimeEntryDrawerOpen = createSelector(
  selectState,
  state => state.isTimeEntryDrawerOpen,
);

export const selectIsTimeAbsenceEntryDrawerOpen = createSelector(
  selectState,
  state => state.isTimeAbsenceEntryDrawerOpen,
);

export const selectIsTimeHolidayEntryModalOpen = createSelector(
  selectState,
  state => state.isTimeHolidayEntryModalOpen,
);
