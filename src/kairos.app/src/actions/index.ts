import { RouterAction } from 'connected-react-router';
import { ActionType } from 'typesafe-actions';

import * as dashboardActions from '../dashboard/actions';
import * as editTimeEntryActions from '../edit-time-entry/actions';
import * as layoutActions from '../layout/actions';
import * as notificationManagerActions from '../notification-manager/actions';
import * as sharedActions from '../shared/actions';

export type LayoutActions = ActionType<typeof layoutActions>;
export type SharedActions = ActionType<typeof sharedActions>;
export type NotificationManagerActions = ActionType<typeof notificationManagerActions>;
export type DashboardActions = ActionType<typeof dashboardActions>;
export type EditTimeEntryActions = ActionType<typeof editTimeEntryActions>;

export type Actions =
  | RouterAction
  | LayoutActions
  | NotificationManagerActions
  | DashboardActions
  | EditTimeEntryActions
  | SharedActions;
