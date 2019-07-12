import { produce } from 'immer';
import { OptionsObject } from 'notistack';
import { action } from 'typesafe-actions';

import { NotificationManagerActions } from '../actions';
import { NotificationModel } from '../models/notification.model';
import { ENQUEUE_SNACKBAR } from './constants';
import { NotificationManagerState } from './state';

export const enqueueSnackbarAction = (message: string, options?: OptionsObject) =>
  action(ENQUEUE_SNACKBAR, new NotificationModel(message, options));

export const enqueueSnackbarReducer = (
  state: NotificationManagerState,
  action: NotificationManagerActions,
): NotificationManagerState =>
  produce(state, draft => {
    switch (action.type) {
      case ENQUEUE_SNACKBAR:
        draft.notifications.push(action.payload);
        break;
    }
  });
