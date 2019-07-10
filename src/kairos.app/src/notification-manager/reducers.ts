import { reduce } from 'ramda';

import { NotificationManagerActions } from '../actions';
import { enqueueSnackbarReducer } from './enqueue-snackbar';
import { removeSnackbarReducer } from './remove-snackbar';
import { INotificationManagerState, notificationManagerInitialState } from './state';

const reducers = [enqueueSnackbarReducer, removeSnackbarReducer];

export const notificationManagerReducers = (
  state = notificationManagerInitialState,
  action: NotificationManagerActions,
): INotificationManagerState =>
  reduce((updatingState, reducer) => reducer(updatingState, action), state, reducers);
