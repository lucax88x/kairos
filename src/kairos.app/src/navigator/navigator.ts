import { LOCATION_CHANGE } from 'connected-react-router';
import { select, takeLatest } from 'redux-saga/effects';
import { selectNavigatorRoute } from '../shared/router.selectors';
import { Route } from '../models/route.model';

function* doUpdateState() {
  const navigatorRoute: Route<{ month: number; day: number }> = yield select(
    selectNavigatorRoute,
  );
  if (!!navigatorRoute) {
    console.log(navigatorRoute.params.month);
    console.log(navigatorRoute.params.day);
    console.log(navigatorRoute);
  }
}

export function* navigatorSaga() {
  yield takeLatest([LOCATION_CHANGE], doUpdateState);
}
