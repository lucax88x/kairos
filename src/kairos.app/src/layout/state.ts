export interface LayoutState {
  isLeftDrawerOpen: boolean;
  isTimeEntryDrawerOpen: boolean;
  isTimeAbsenceEntryDrawerOpen: boolean;
}

export const layoutInitialState: LayoutState = {
  isLeftDrawerOpen: false,
  isTimeEntryDrawerOpen: false,
  isTimeAbsenceEntryDrawerOpen: false,
};
