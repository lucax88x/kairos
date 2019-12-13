import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { ProfileActions } from '../actions';
import { selectIsAuthenticated } from '../auth/selectors';
import { ProfileModel } from '../models/profile.model';
import { getProfile } from '../services/profile/profile.service';
import { IS_ONLINE } from '../shared/constants';
import { selectIsOnline } from '../shared/selectors';
import {
  GET_PROFILE,
  GET_PROFILE_FAILURE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
} from './constants';
import { ProfileState } from './state';

export const getProfileAsync = createAsyncAction(
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
)<void, ProfileModel, string>();

function* doGetProfileOnOtherActions() {
  yield put(getProfileAsync.request());
}

function* doGetProfile() {
  const isAuthenticated = yield select(selectIsAuthenticated);

  if (isAuthenticated) {
    const isOnline = yield select(selectIsOnline);
    if (!isOnline) {
      yield put(getProfileAsync.failure(''));
      return;
    }

    try {
      const profile = yield call(getProfile);

      yield put(getProfileAsync.success(profile));
    } catch (error) {
      yield put(getProfileAsync.failure(error.message));
    }
  }
}

export function* getProfileSaga() {
  yield takeLatest(
    [UPDATE_PROFILE_SUCCESS, IS_ONLINE],
    doGetProfileOnOtherActions,
  );
  yield takeLatest(GET_PROFILE, doGetProfile);

  yield put(getProfileAsync.request());
}

export const getProfileReducer = (
  state: ProfileState,
  action: ProfileActions,
): ProfileState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_PROFILE:
        draft.ui.busy.getProfile = true;
        break;
      case GET_PROFILE_SUCCESS:
        draft.ui.busy.getProfile = false;
        draft.profile = action.payload;
        break;
      case GET_PROFILE_FAILURE:
        draft.ui.busy.getProfile = false;
        break;
    }
  });
