import produce from 'immer';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { CLOSE_CONFIRMATION_MODAL } from './constants';
import { SharedState } from './state';

export const closeConfirmationModalAction = () => action(CLOSE_CONFIRMATION_MODAL);

export const closeConfirmationModalReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case CLOSE_CONFIRMATION_MODAL:
        draft.ui.modal.confirmation = false;
        break;
    }
  });
