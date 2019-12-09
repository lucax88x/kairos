import { produce } from 'immer';
import { select, takeLatest, put } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { SELECT_YEAR } from './constants';
import { selectPrivateWithYearRoute } from './router.selectors';
import { SharedState } from './state';
import { RouteMatcher, buildPrivateRouteWithYear } from '../routes';
import { push } from 'connected-react-router';

export const selectYear = (year: number) => action(SELECT_YEAR, year);

function* updateUrl({ payload }: ReturnType<typeof selectYear>) {
  const isPrivateWithYearRoute = yield select(selectPrivateWithYearRoute);

  if (
    !!isPrivateWithYearRoute &&
    isPrivateWithYearRoute.params &&
    isPrivateWithYearRoute.params.year
  ) {
    const year = parseInt(isPrivateWithYearRoute.params.year);

    if (!isNaN(year) && year > 1900 && year < 3000) {
      const pathname = window.location.pathname;
      const newPrefixWithYear = buildPrivateRouteWithYear(RouteMatcher.PrivateWithYear, payload);
      const restOfUrl = pathname.substr(pathname.indexOf(year.toString()) + 4);

      yield put(push(newPrefixWithYear + restOfUrl));
    }
  }
}

export function* selectYearSaga() {
  yield takeLatest(SELECT_YEAR, updateUrl);
}

export const selectYearReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case SELECT_YEAR:
        draft.selectedYear = action.payload;
        break;
    }
  });
