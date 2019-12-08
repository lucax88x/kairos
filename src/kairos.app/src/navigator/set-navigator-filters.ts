import { LOCATION_CHANGE, push } from 'connected-react-router';
import { endOfDay, getDate, getMonth, isEqual, startOfDay } from 'date-fns';
import produce from 'immer';
import { put, select, takeLatest, debounce } from 'redux-saga/effects';
import { action, PayloadAction } from 'typesafe-actions';
import { NavigatorActions } from '../actions';
import { Route } from '../models/route.model';
import {
  buildNavigatorRoute,
  buildPrivateRouteWithYear,
  RouteMatcher,
} from '../routes';
import { selectNavigatorRoute } from '../shared/router.selectors';
import { selectSelectedYear } from '../shared/selectors';
import { SET_NAVIGATOR_FILTERS } from './constants';
import { selectEndDate, selectStartDate } from './selectors';
import { NavigatorState } from './state';

export const setNavigatorFilters = (start: Date, end: Date) =>
  action(SET_NAVIGATOR_FILTERS, { start, end });

function* doUpdateState() {
  const navigatorRoute: Route<{ month: number; day: number }> = yield select(
    selectNavigatorRoute,
  );
  if (!!navigatorRoute) {
    const year = yield select(selectSelectedYear);
    const currentStart = yield select(selectStartDate);
    const currentEnd = yield select(selectEndDate);

    const month = navigatorRoute.params.month - 1;
    const day = navigatorRoute.params.day;

    const date = new Date(year, month, day);

    const start = startOfDay(date);
    const end = endOfDay(date);

    if (!isEqual(currentStart, start) || !isEqual(currentEnd, end)) {
      yield put(setNavigatorFilters(start, end));
    }
  }
}

function* doUpdateRoute({
  payload: { start, end },
}: PayloadAction<string, { start: Date; end: Date }>) {
  const year = yield select(selectSelectedYear);

  // it's exactly 1 day difference
  if (isEqual(start, startOfDay(start)) && isEqual(end, endOfDay(end))) {
    yield put(
      push(buildNavigatorRoute(year, getMonth(start) + 1, getDate(start))),
    );
  } else {
    yield put(
      push(buildPrivateRouteWithYear(RouteMatcher.NavigatorCustom, year)),
    );
  }
}

export function* setNavigatorFiltersSaga() {
  yield debounce(500, [LOCATION_CHANGE], doUpdateState);
  yield debounce(500, [SET_NAVIGATOR_FILTERS], doUpdateRoute);
}

export const setNavigatorFiltersReducer = (
  state: NavigatorState,
  action: NavigatorActions,
): NavigatorState =>
  produce(state, draft => {
    switch (action.type) {
      case SET_NAVIGATOR_FILTERS:
        draft.startDate = action.payload.start;
        draft.endDate = action.payload.end;
        break;
    }
  });
