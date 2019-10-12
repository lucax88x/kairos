import { RouterState } from 'connected-react-router';
import { PersistPartial } from 'redux-persist/lib/persistReducer';
import { AuthState } from '../auth/state';
import { BulkInsertState } from '../bulk-insert/state';
import { EditTimeAbsenceEntryState } from '../edit-time-absence-entry/state';
import { EditTimeEntryState } from '../edit-time-entry/state';
import { EditTimeHolidayEntryState } from '../edit-time-holiday-entry/state';
import { ExportState } from '../export/state';
import { LayoutState } from '../layout/state';
import { NotificationManagerState } from '../notification-manager/state';
import { ProfileState } from '../profile/state';
import { SharedState } from '../shared/state';

export interface State {
  router: RouterState;
  layout: LayoutState;
  shared: SharedState & PersistPartial;
  auth: AuthState;
  profile: ProfileState;
  notificationManager: NotificationManagerState;
  editTimeEntry: EditTimeEntryState;
  editTimeAbsenceEntry: EditTimeAbsenceEntryState;
  editTimeHolidayEntry: EditTimeHolidayEntryState;
  bulkInsert: BulkInsertState;
  export: ExportState;
}

export type States =
  | RouterState
  | LayoutState
  | SharedState
  | AuthState
  | ProfileState
  | NotificationManagerState
  | EditTimeEntryState
  | EditTimeAbsenceEntryState
  | BulkInsertState
  | ExportState;
