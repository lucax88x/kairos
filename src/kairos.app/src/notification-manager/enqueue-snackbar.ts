import { produce } from 'immer';
import { OptionsObject } from 'notistack';
import { action } from 'typesafe-actions';

import { NotificationManagerActions } from '.';
import { NotificationModel } from '../models/notification.model';
import { ENQUEUE_SNACKBAR } from './constants';
import { INotificationManagerState } from './state';

export const enqueueSnackbarAction = (message: string, options?: OptionsObject) =>
  action(ENQUEUE_SNACKBAR, new NotificationModel(message, options));

export const enqueueSnackbarReducer = (
  state: INotificationManagerState,
  action: NotificationManagerActions,
): INotificationManagerState =>
  produce(state, draft => {
    switch (action.type) {
      case ENQUEUE_SNACKBAR:
        console.log('in');
        draft.notifications.push(action.payload);
        break;
    }
  });
