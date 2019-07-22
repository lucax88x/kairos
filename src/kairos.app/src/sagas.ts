import { all } from '@redux-saga/core/effects';
import { map, values } from 'ramda';

import * as dashboardSagas from './dashboard/sagas';
import * as editTimeEntrySagas from './edit-time-entry/sagas';
import * as sharedSagas from './shared/sagas';

// tslint:disable-next-line: no-any
export const featureSagas: any[] = [sharedSagas, dashboardSagas, editTimeEntrySagas];

const sagas = map(module => values(module), featureSagas);

export function* rootSagas() {
  yield all(map(saga => saga(), sagas.flat(1)));
}
