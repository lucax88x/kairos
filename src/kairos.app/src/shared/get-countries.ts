import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { Route } from '../models/route.model';
import { getCountries } from '../services/country/country.service';
import { selectTimeHolidayEntriesRoute } from '../shared/router.selectors';
import { GET_COUNTRIES, GET_COUNTRIES_FAILURE, GET_COUNTRIES_SUCCESS } from './constants';
import { SharedState } from './state';
import { CountryModel } from '../models/country.model';

export const getCountriesAsync = createAsyncAction(
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_FAILURE,
)<void, CountryModel[], string>();

function* doGetCountriesOnOtherActions() {
  const timeHolidayEntriesRoute: Route = yield select(selectTimeHolidayEntriesRoute);

  if (!!timeHolidayEntriesRoute) {
    yield put(getCountriesAsync.request());
  }
}

function* doGetCountries() {
  try {
    const countries = yield call(getCountries);

    yield put(getCountriesAsync.success(countries));
  } catch (error) {
    yield put(getCountriesAsync.failure(error.message));
  }
}

export function* getCountriesSaga() {
  yield takeLatest([LOCATION_CHANGE], doGetCountriesOnOtherActions);
  yield takeLatest(GET_COUNTRIES, doGetCountries);
}

export const getCountriesReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_COUNTRIES:
        draft.ui.busy.getCountries = true;
        draft.countries = [];
        break;
      case GET_COUNTRIES_SUCCESS:
        draft.ui.busy.getCountries = false;
        draft.countries = action.payload;
        break;
      case GET_COUNTRIES_FAILURE:
        draft.ui.busy.getCountries = false;
        break;
    }
  });
