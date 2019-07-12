import { RouterState } from 'connected-react-router';

import { DashboardState } from '../dashboard/state';
import { NotificationManagerState } from '../notification-manager/state';

export interface State {
  router: RouterState;
  notificationManager: NotificationManagerState;
  dashboard: DashboardState;
}

export type States = RouterState | NotificationManagerState | DashboardState;
