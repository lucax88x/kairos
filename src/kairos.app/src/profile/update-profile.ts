import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { ProfileActions } from '../actions';
import { i18n } from '../i18nLoader';
import { ProfileModel } from '../models/profile.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { updateProfile } from '../services/profile/profile.service';
import { UPDATE_PROFILE, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_SUCCESS } from './constants';
import { ProfileState } from './state';
import { t } from '@lingui/macro';

export const updateProfileAsync = createAsyncAction(
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
)<{ model: ProfileModel }, void, string>();

function* doUpdateProfile({ payload: { model } }: ReturnType<typeof updateProfileAsync.request>) {
  try {
    yield call(updateProfile, model);

    yield put(updateProfileAsync.success());
  } catch (error) {
    yield put(updateProfileAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Profile Saved`), { variant: 'success' }));
}

export function* updateProfileSaga() {
  yield takeLatest(UPDATE_PROFILE_SUCCESS, doNotifySuccess);
  yield takeLatest(UPDATE_PROFILE, doUpdateProfile);
}

export const updateProfileReducer = (state: ProfileState, action: ProfileActions): ProfileState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_PROFILE:
        draft.ui.busy.updateProfile = true;
        break;
      case UPDATE_PROFILE_SUCCESS:
        draft.ui.busy.updateProfile = false;
        break;
      case UPDATE_PROFILE_FAILURE:
        draft.ui.busy.updateProfile = false;
        break;
    }
  });
