import { RouterState } from 'connected-react-router';

import { NotificationManagerState } from './notification-manager.state';

export interface State {
  router: RouterState;
  notificationManager: NotificationManagerState;
}

export type States = RouterState | NotificationManagerState;
