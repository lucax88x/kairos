import { produce } from 'immer';
import { action } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { SELECT_LANGUAGE } from './constants';
import { SharedState } from './state';
import { Language } from '../models/language-model';

export const selectLanguage = (language: Language) => action(SELECT_LANGUAGE, language);

export const selectLanguageReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case SELECT_LANGUAGE:
        draft.selectedLanguage = action.payload;
        break;
    }
  });
