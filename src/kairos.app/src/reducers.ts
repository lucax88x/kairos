import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import localforage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { authReducers } from './auth/reducers';
import { bulkInsertReducers } from './bulk-insert/reducers';
import { editTimeAbsenceEntryReducers } from './edit-time-absence-entry/reducers';
import { editTimeEntryReducers } from './edit-time-entry/reducers';
import { editTimeHolidayEntryReducers } from './edit-time-holiday-entry/reducers';
import { layoutReducers } from './layout/reducers';
import { notificationManagerReducers } from './notification-manager/reducers';
import { profileReducers } from './profile/reducers';
import { sharedReducers } from './shared/reducers';
import { exportReducers } from './export/reducers';
import { State } from './state';

const basePersistConfig = {
  storage: localforage,
};

const sharedPersistConfig = {
  ...basePersistConfig,
  key: 'shared',
  whitelist: ['selectedLanguage', 'selectedYear'],
};

// tslint:disable-next-line: no-any
export const rootReducers = (history: History<any>) =>
  combineReducers<State>({
    router: connectRouter(history),
    layout: layoutReducers,
    shared: persistReducer(sharedPersistConfig, sharedReducers),
    auth: authReducers,
    profile: profileReducers,
    notificationManager: notificationManagerReducers,
    editTimeEntry: editTimeEntryReducers,
    editTimeHolidayEntry: editTimeHolidayEntryReducers,
    editTimeAbsenceEntry: editTimeAbsenceEntryReducers,
    bulkInsert: bulkInsertReducers,
    export: exportReducers,
  });
