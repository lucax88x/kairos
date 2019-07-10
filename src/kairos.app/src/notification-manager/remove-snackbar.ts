import { produce } from 'immer';
import { findIndex } from 'ramda';
import { action } from 'typesafe-actions';

import { NotificationManagerActions } from '.';
import { UUID } from '../models/uuid.model';
import { REMOVE_SNACKBAR } from './constants';
import { INotificationManagerState } from './state';

export const removeSnackbarAction = (key: UUID) => action(REMOVE_SNACKBAR, key);

export const removeSnackbarReducer = (
  state: INotificationManagerState,
  action: NotificationManagerActions,
): INotificationManagerState =>
  produce(state, draft => {
    switch (action.type) {
      case REMOVE_SNACKBAR:
        draft.notifications.splice(
          findIndex(n => n.key.equals(action.payload), draft.notifications),
        );
        break;
    }
  });
