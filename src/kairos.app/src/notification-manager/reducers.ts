import { produce } from 'immer';

import { NotificationManagerActions } from '.';
import { INotificationManagerState, notificationManagerInitialState } from './state';

export const notificationManagerReducers = (
  state = notificationManagerInitialState,
  action: NotificationManagerActions,
): INotificationManagerState => produce(state, draft => {});
