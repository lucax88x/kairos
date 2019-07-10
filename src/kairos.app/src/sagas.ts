import { all } from '@redux-saga/core/effects';
import { map, values } from 'ramda';

import * as dashboardSagas from './dashboard/sagas';
import * as sharedSagas from './shared/sagas';

export const featureSagas: any[] = [sharedSagas, dashboardSagas];

const sagas = map(module => values(module), featureSagas);

export function* rootSagas() {
  yield all(map(saga => saga(), sagas.flat(1)));
}
