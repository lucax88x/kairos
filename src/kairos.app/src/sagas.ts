import { all } from '@redux-saga/core/effects';
import { map, values } from 'ramda';

import * as authSagas from './auth/sagas';
import * as bulkInsertSagas from './bulk-insert/sagas';
import * as navigatorSagas from './navigator/sagas';
import * as editTimeAbsenceEntrySagas from './edit-time-absence-entry/sagas';
import * as editTimeHolidayEntrySagas from './edit-time-holiday-entry/sagas';
import * as editTimeEntrySagas from './edit-time-entry/sagas';
import * as layoutSagas from './layout/sagas';
import * as profileSagas from './profile/sagas';
import * as sharedSagas from './shared/sagas';
import * as exportSagas from './export/sagas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const featureSagas: any[] = [
  sharedSagas,
  authSagas,
  layoutSagas,
  navigatorSagas,
  editTimeEntrySagas,
  editTimeAbsenceEntrySagas,
  editTimeHolidayEntrySagas,
  bulkInsertSagas,
  profileSagas,
  exportSagas,
];

const sagas = map(module => values(module), featureSagas);

export function* rootSagas() {
  yield all(map(saga => saga(), sagas.flat(1)));
}
