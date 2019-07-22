import { RouterState } from 'connected-react-router';

import { DashboardState } from '../dashboard/state';
import { EditTimeEntryState } from '../edit-time-entry/state';
import { LayoutState } from '../layout/state';
import { NotificationManagerState } from '../notification-manager/state';
import { SharedState } from '../shared/state';

export interface State {
  router: RouterState;
  layout: LayoutState;
  shared: SharedState;
  notificationManager: NotificationManagerState;
  dashboard: DashboardState;
  editTimeEntry: EditTimeEntryState;
}

export type States =
  | RouterState
  | LayoutState
  | SharedState
  | NotificationManagerState
  | DashboardState
  | EditTimeEntryState;
