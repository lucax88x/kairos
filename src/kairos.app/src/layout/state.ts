export interface LayoutState {
  isLeftDrawerOpen: boolean;
  isRightDrawerOpen: boolean;
}

export const layoutInitialState: LayoutState = {
  isLeftDrawerOpen: false,
  isRightDrawerOpen: false,
};
