import { LOCATION_CHANGE, push } from 'connected-react-router';
import { select, takeLatest, put } from 'redux-saga/effects';
import { selectRedirectDashboardRoute } from './router.selectors';
import { selectSelectedYear } from './selectors';
import { buildPrivateRouteWithYear, RouteMatcher } from '../routes';

function* redirectOnDashboard() {
  const redirectDashboardRoute = yield select(selectRedirectDashboardRoute);

  if (!!redirectDashboardRoute) {
    const year = yield select(selectSelectedYear);
    yield put(push(buildPrivateRouteWithYear(RouteMatcher.Dashboard, year)));
  }
}

export function* redirectOnDashboardSaga() {
  yield takeLatest(LOCATION_CHANGE, redirectOnDashboard);
}
