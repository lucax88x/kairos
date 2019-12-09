import { RouterAction } from 'connected-react-router';
import { ActionType } from 'typesafe-actions';

import * as layoutActions from '../layout/actions';
import * as authActions from '../auth/actions';
import * as profileActions from '../profile/actions';
import * as bulkInsertActions from '../bulk-insert/actions';
import * as editTimeAbsenceEntryActions from '../edit-time-absence-entry/actions';
import * as editTimeHolidayEntryActions from '../edit-time-holiday-entry/actions';
import * as editTimeEntryActions from '../edit-time-entry/actions';
import * as navigatorActions from '../navigator/actions';
import * as notificationManagerActions from '../notification-manager/actions';
import * as sharedActions from '../shared/actions';
import * as exportActions from '../export/actions';

export type LayoutActions = ActionType<typeof layoutActions>;
export type SharedActions = ActionType<typeof sharedActions>;
export type AuthActions = ActionType<typeof authActions>;
export type ProfileActions = ActionType<typeof profileActions>;
export type NotificationManagerActions = ActionType<
  typeof notificationManagerActions
>;
export type NavigatorActions = ActionType<typeof navigatorActions>;
export type EditTimeEntryActions = ActionType<typeof editTimeEntryActions>;
export type EditTimeAbsenceEntryActions = ActionType<
  typeof editTimeAbsenceEntryActions
>;
export type EditTimeHolidayEntryActions = ActionType<
  typeof editTimeHolidayEntryActions
>;
export type BulkInsertActions = ActionType<typeof bulkInsertActions>;
export type ExportActions = ActionType<typeof exportActions>;

export type Actions =
  | RouterAction
  | LayoutActions
  | SharedActions
  | ProfileActions
  | NotificationManagerActions
  | NavigatorActions
  | EditTimeEntryActions
  | EditTimeAbsenceEntryActions
  | EditTimeHolidayEntryActions
  | AuthActions
  | BulkInsertActions
  | ExportActions;
