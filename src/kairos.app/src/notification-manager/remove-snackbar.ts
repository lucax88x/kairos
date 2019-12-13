import { produce } from 'immer';
import { findIndex } from 'ramda';
import { action } from 'typesafe-actions';

import { NotificationManagerActions } from '../actions';
import { UUID } from '../models/uuid.model';
import { REMOVE_SNACKBAR } from './constants';
import { NotificationManagerState } from './state';

export const removeSnackbarAction = (key: UUID) => action(REMOVE_SNACKBAR, key);

export const removeSnackbarReducer = (
  state: NotificationManagerState,
  action: NotificationManagerActions,
): NotificationManagerState =>
  produce(state, draft => {
    switch (action.type) {
      case REMOVE_SNACKBAR:
        draft.notifications.splice(
          findIndex(n => UUID.equals(n.key, action.payload), draft.notifications),
        );
        break;
    }
  });
