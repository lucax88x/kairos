import { all } from '@redux-saga/core/effects';
import { map, values } from 'ramda';

import * as authSagas from './auth/sagas';
import * as dashboardSagas from './dashboard/sagas';
import * as editTimeAbsenceEntrySagas from './edit-time-absence-entry/sagas';
import * as editTimeEntrySagas from './edit-time-entry/sagas';
import * as sharedSagas from './shared/sagas';

// tslint:disable-next-line: no-any
export const featureSagas: any[] = [
  sharedSagas,
  authSagas,
  dashboardSagas,
  editTimeEntrySagas,
  editTimeAbsenceEntrySagas,
];

const sagas = map(module => values(module), featureSagas);

export function* rootSagas() {
  yield all(map(saga => saga(), sagas.flat(1)));
}
