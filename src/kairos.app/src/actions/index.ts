import { RouterAction } from 'connected-react-router';
import { ActionType } from 'typesafe-actions';

import * as dashboardActions from '../dashboard/actions';
import * as notificationManagerActions from '../notification-manager/actions';
import * as sharedActions from '../shared/actions';

export type SharedActions = ActionType<typeof sharedActions>;
export type NotificationManagerActions = ActionType<typeof notificationManagerActions>;
export type DashboardActions = ActionType<typeof dashboardActions>;

export type Actions = RouterAction | NotificationManagerActions | DashboardActions | SharedActions;
