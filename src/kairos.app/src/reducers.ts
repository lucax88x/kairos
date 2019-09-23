import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { authReducers } from './auth/reducers';
import { bulkInsertReducers } from './bulk-insert/reducers';
import { editTimeAbsenceEntryReducers } from './edit-time-absence-entry/reducers';
import { editTimeEntryReducers } from './edit-time-entry/reducers';
import { editTimeHolidayEntryReducers } from './edit-time-holiday-entry/reducers';
import { layoutReducers } from './layout/reducers';
import { notificationManagerReducers } from './notification-manager/reducers';
import { profileReducers } from './profile/reducers';
import { sharedReducers } from './shared/reducers';
import { State } from './state';

// tslint:disable-next-line: no-any
export const rootReducers = (history: History<any>) =>
  combineReducers<State>({
    router: connectRouter(history),
    layout: layoutReducers,
    shared: sharedReducers,
    auth: authReducers,
    profile: profileReducers,
    notificationManager: notificationManagerReducers,
    editTimeEntry: editTimeEntryReducers,
    editTimeHolidayEntry: editTimeHolidayEntryReducers,
    editTimeAbsenceEntry: editTimeAbsenceEntryReducers,
    bulkInsert: bulkInsertReducers,
  });
