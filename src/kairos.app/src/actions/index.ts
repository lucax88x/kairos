import { RouterAction } from 'connected-react-router';
import { ActionType } from 'typesafe-actions';

import * as authActions from '../auth/actions';
import * as bulkInsertActions from '../bulk-insert/actions';
import * as editTimeAbsenceEntryActions from '../edit-time-absence-entry/actions';
import * as editTimeEntryActions from '../edit-time-entry/actions';
import * as layoutActions from '../layout/actions';
import * as notificationManagerActions from '../notification-manager/actions';
import * as sharedActions from '../shared/actions';

export type LayoutActions = ActionType<typeof layoutActions>;
export type SharedActions = ActionType<typeof sharedActions>;
export type AuthActions = ActionType<typeof authActions>;
export type NotificationManagerActions = ActionType<typeof notificationManagerActions>;
export type EditTimeEntryActions = ActionType<typeof editTimeEntryActions>;
export type EditTimeAbsenceEntryActions = ActionType<typeof editTimeAbsenceEntryActions>;
export type BulkInsertActions = ActionType<typeof bulkInsertActions>;

export type Actions =
  | RouterAction
  | LayoutActions
  | SharedActions
  | NotificationManagerActions
  | EditTimeEntryActions
  | EditTimeAbsenceEntryActions
  | AuthActions
  | BulkInsertActions;
