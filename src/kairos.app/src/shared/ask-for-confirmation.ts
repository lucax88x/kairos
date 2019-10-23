import produce from 'immer';
import { put, race, take } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { closeConfirmationModalAction } from './close-confirmation-modal';
import { CONFIRMATION_APPROVED, CONFIRMATION_REJECTED, OPEN_CONFIRMATION_MODAL } from './constants';
import { SharedState } from './state';

export interface AskForConfirmationConfiguration {
  title: string | null;
  approveButton: string | null;
  rejectButton: string | null;
  message: string | null;
}

export const openConfirmationModalAction = (configuration: AskForConfirmationConfiguration) =>
  action(OPEN_CONFIRMATION_MODAL, configuration);

export const confirmationApprovedAction = () => action(CONFIRMATION_APPROVED);
export const confirmationRejectedAction = () => action(CONFIRMATION_REJECTED);

export function* askForConfirmation(messages: AskForConfirmationConfiguration) {
  yield put(openConfirmationModalAction(messages));

  const { yes } = yield race({
    yes: take(CONFIRMATION_APPROVED),
    no: take(CONFIRMATION_REJECTED),
  });

  yield put(closeConfirmationModalAction());

  return !!yes;
}

export const openConfirmationModalReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_CONFIRMATION_MODAL:
        const { title, message, approveButton, rejectButton } = action.payload;

        draft.ui.modal.confirmation = true;
        draft.ui.confirmation.title = title;
        draft.ui.confirmation.message = message;
        draft.ui.confirmation.approveButton = approveButton;
        draft.ui.confirmation.rejectButton = rejectButton;
        break;
    }
  });
