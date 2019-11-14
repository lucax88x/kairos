import { createSelector } from 'reselect';
import { State } from '../state';

const selectState = (state: State) => state.shared;

export const selectIsOnline = createSelector(
  selectState,
  state => state.isOnline,
);

export const selectRefreshDate = createSelector(
  selectState,
  state => state.refreshDate,
);

export const selectSelectedYear = createSelector(
  selectState,
  state => state.selectedYear,
);

export const selectSelectedLanguage = createSelector(
  selectState,
  state => state.selectedLanguage,
);

export const selectCountries = createSelector(
  selectState,
  state => state.countries,
);

export const selectTimeEntries = createSelector(
  selectState,
  state => state.timeEntries,
);

export const selectTimeAbsenceEntries = createSelector(
  selectState,
  state => state.timeAbsenceEntries,
);

export const selectTimeHolidayEntries = createSelector(
  selectState,
  state => state.timeHolidayEntries,
);

export const selectUi = createSelector(
  selectState,
  state => state.ui,
);

export const selectBusy = createSelector(
  selectUi,
  ui => ui.busy,
);

export const selectModal = createSelector(
  selectUi,
  ui => ui.modal,
);

export const selectConfirmation = createSelector(
  selectUi,
  ui => ui.confirmation,
);

export const selectIsGetCountriesBusy = createSelector(
  selectBusy,
  busy => busy.getCountries,
);

export const selectIsGetTimeEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeEntries,
);

export const selectIsCreateTimeEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeEntry,
);

export const selectIsDeleteTimeEntriesBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeEntries,
);

export const selectIsGetTimeAbsenceEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeAbsenceEntries,
);

export const selectIsCreateTimeAbsenceEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeAbsenceEntry,
);

export const selectIsDeleteTimeAbsenceEntriesBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeAbsenceEntries,
);

export const selectIsGetTimeHolidayEntriesBusy = createSelector(
  selectBusy,
  busy => busy.getTimeHolidayEntries,
);

export const selectIsCreateTimeHolidayEntryBusy = createSelector(
  selectBusy,
  busy => busy.createTimeHolidayEntry,
);

export const selectIsDeleteTimeHolidayEntriesBusy = createSelector(
  selectBusy,
  busy => busy.deleteTimeHolidayEntries,
);

export const selectIsUpdateTimeHolidayEntriesByCountry = createSelector(
  selectBusy,
  busy => busy.updateTimeHolidayEntriesByCountry,
);

export const selectIsConfirmationModalOpen = createSelector(
  selectModal,
  modal => modal.confirmation,
);

export const selectConfirmationApproveButton = createSelector(
  selectConfirmation,
  confirmation => confirmation.approveButton,
);

export const selectConfirmationRejectButton = createSelector(
  selectConfirmation,
  confirmation => confirmation.rejectButton,
);

export const selectConfirmationMessage = createSelector(
  selectConfirmation,
  confirmation => confirmation.message,
);

export const selectConfirmationTitle = createSelector(
  selectConfirmation,
  confirmation => confirmation.title,
);
