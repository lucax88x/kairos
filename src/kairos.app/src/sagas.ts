import { all } from '@redux-saga/core/effects';
import { map, values } from 'ramda';

import * as authSagas from './auth/sagas';
import * as bulkInsertSagas from './bulk-insert/sagas';
import * as editTimeAbsenceEntrySagas from './edit-time-absence-entry/sagas';
import * as editTimeEntrySagas from './edit-time-entry/sagas';
import * as layoutSagas from './layout/sagas';
import * as profileSagas from './profile/sagas';
import * as sharedSagas from './shared/sagas';

// tslint:disable-next-line: no-any
export const featureSagas: any[] = [
  sharedSagas,
  authSagas,
  layoutSagas,
  editTimeEntrySagas,
  editTimeAbsenceEntrySagas,
  bulkInsertSagas,
  profileSagas,
];

const sagas = map(module => values(module), featureSagas);

export function* rootSagas() {
  yield all(map(saga => saga(), sagas.flat(1)));
}
