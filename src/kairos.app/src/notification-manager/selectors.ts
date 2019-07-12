import { createSelector } from 'reselect';

import { State } from '../state';

const selectState = (state: State) => state.notificationManager;

export const selectNotifications = createSelector(
  selectState,
  state => state.notifications,
);
