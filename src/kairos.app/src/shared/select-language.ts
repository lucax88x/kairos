import 'moment/locale/it';
import 'moment/locale/en-gb';

import { produce } from 'immer';
import { action } from 'typesafe-actions';
import moment from 'moment';

import { SharedActions } from '../actions';
import { SELECT_LANGUAGE, SELECTED_LANGUAGE } from './constants';
import { SharedState } from './state';
import { Language } from '../models/language-model';
import { put, takeLatest } from 'redux-saga/effects';

export const selectLanguage = (language: Language) => action(SELECT_LANGUAGE, language);
export const selectedLanguage = (language: Language) => action(SELECTED_LANGUAGE, language);

function* setupLanguage({ payload }: ReturnType<typeof selectLanguage>) {
  moment.locale(payload);

  yield put(selectedLanguage(payload));
}

export function* selectLanguageSaga() {
  yield takeLatest(SELECT_LANGUAGE, setupLanguage);
}

export const selectLanguageReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case SELECTED_LANGUAGE:
        draft.selectedLanguage = action.payload;
        break;
    }
  });
