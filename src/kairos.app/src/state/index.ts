import { RouterState } from 'connected-react-router';

import { AuthState } from '../auth/state';
import { BulkInsertState } from '../bulk-insert/state';
import { EditTimeAbsenceEntryState } from '../edit-time-absence-entry/state';
import { EditTimeEntryState } from '../edit-time-entry/state';
import { LayoutState } from '../layout/state';
import { NotificationManagerState } from '../notification-manager/state';
import { SharedState } from '../shared/state';

export interface State {
  router: RouterState;
  layout: LayoutState;
  shared: SharedState;
  auth: AuthState;
  notificationManager: NotificationManagerState;
  editTimeEntry: EditTimeEntryState;
  editTimeAbsenceEntry: EditTimeAbsenceEntryState;
  bulkInsert: BulkInsertState;
}

export type States =
  | RouterState
  | LayoutState
  | SharedState
  | AuthState
  | NotificationManagerState
  | EditTimeEntryState
  | EditTimeAbsenceEntryState
  | BulkInsertState;
