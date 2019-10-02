export interface LayoutState {
  isLeftDrawerOpen: boolean;
  isRightDrawerOpen: boolean;
  isTimeEntryDrawerOpen: boolean;
  isTimeAbsenceEntryDrawerOpen: boolean;
  isTimeHolidayEntryModalOpen: boolean;
}

export const layoutInitialState: LayoutState = {
  isLeftDrawerOpen: false,
  isRightDrawerOpen: false,
  isTimeEntryDrawerOpen: false,
  isTimeAbsenceEntryDrawerOpen: false,
  isTimeHolidayEntryModalOpen: false,
};
