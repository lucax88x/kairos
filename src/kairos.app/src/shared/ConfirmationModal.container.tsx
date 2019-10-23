import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { State } from '../state';
import { confirmationApprovedAction, confirmationRejectedAction } from './ask-for-confirmation';
import {
  ConfirmationModalComponent,
  ConfirmationModalDispatches,
  ConfirmationModalInputs,
} from './ConfirmationModal';
import {
  selectConfirmationApproveButton,
  selectConfirmationMessage,
  selectConfirmationRejectButton,
  selectConfirmationTitle,
  selectIsConfirmationModalOpen,
} from './selectors';

const mapStateToProps = (state: State): ConfirmationModalInputs => ({
  isOpen: selectIsConfirmationModalOpen(state),
  title: selectConfirmationTitle(state),
  message: selectConfirmationMessage(state),
  rejectButton: selectConfirmationRejectButton(state),
  approveButton: selectConfirmationApproveButton(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): ConfirmationModalDispatches => ({
  onReject: () => dispatch(confirmationRejectedAction()),
  onApprove: () => dispatch(confirmationApprovedAction()),
});

export const ConfirmationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationModalComponent);
