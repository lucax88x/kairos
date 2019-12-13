import { navigatorReducers } from './navigator/reducers';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import localforage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer, createTransform } from 'redux-persist';
import { authReducers } from './auth/reducers';
import { bulkInsertReducers } from './bulk-insert/reducers';
import { editTimeAbsenceEntryReducers } from './edit-time-absence-entry/reducers';
import { editTimeEntryReducers } from './edit-time-entry/reducers';
import { editTimeHolidayEntryReducers } from './edit-time-holiday-entry/reducers';
import { exportReducers } from './export/reducers';
import { layoutReducers } from './layout/reducers';
import { notificationManagerReducers } from './notification-manager/reducers';
import { profileReducers } from './profile/reducers';
import { sharedReducers } from './shared/reducers';
import { State } from './state';

const replacer = (key: string, value: any) =>
  value instanceof Date ? value.toISOString() : value;
const reviver = (key: string, value: any) =>
  typeof value === 'string' &&
  value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    ? new Date(value)
    : value;
export const encode = (toDeshydrate: any) =>
  JSON.stringify(toDeshydrate, replacer);
export const decode = (toRehydrate: any) => JSON.parse(toRehydrate, reviver);

const basePersistConfig = {
  storage: localforage,
  transforms: [createTransform(encode, decode)],
};

const sharedPersistConfig = {
  ...basePersistConfig,
  key: 'shared',
  whitelist: [
    'selectedLanguage',
    'timeEntries',
    'timeAbsenceEntries',
    'timeHolidayEntries',
  ],
};

const profilePersistConfig = {
  ...basePersistConfig,
  key: 'profile',
  whitelist: ['profile'],
};

// tslint:disable-next-line: no-any
export const rootReducers = (history: History<any>) =>
  combineReducers<State>({
    router: connectRouter(history),
    layout: layoutReducers,
    shared: persistReducer(sharedPersistConfig, sharedReducers),
    auth: authReducers,
    profile: persistReducer(profilePersistConfig, profileReducers),
    notificationManager: notificationManagerReducers,
    navigator: navigatorReducers,
    editTimeEntry: editTimeEntryReducers,
    editTimeHolidayEntry: editTimeHolidayEntryReducers,
    editTimeAbsenceEntry: editTimeAbsenceEntryReducers,
    bulkInsert: bulkInsertReducers,
    export: exportReducers,
  });
