import React from 'react';
import { Trans } from '@lingui/macro';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';

export interface ConfirmationModalInputs {
  isOpen: boolean;
  title: string | null;
  message: string | null;
  approveButton: string | null;
  rejectButton: string | null;
}

export interface ConfirmationModalDispatches {
  onReject: () => void;
  onApprove: () => void;
}

type ConfirmationModalProps = ConfirmationModalInputs & ConfirmationModalDispatches;

export const ConfirmationModalComponent: React.FC<ConfirmationModalProps> = props => {
  const { isOpen, title, message, approveButton, rejectButton, onReject, onApprove } = props;
  return (
    <Dialog open={isOpen} onClose={onReject} aria-labelledby="form-dialog-title">
      <DialogTitle>{!!title ? title : <Trans>ConfirmationModal.Title</Trans>}</DialogTitle>
      <DialogContent>{!!message ? message : <Trans>ConfirmationModal.Message</Trans>}</DialogContent>
      <DialogActions>
        <Button onClick={onReject}>
          {!!rejectButton ? rejectButton : <Trans>ConfirmationModal.Reject</Trans>}
        </Button>
        <Button onClick={onApprove} autoFocus>
          {!!approveButton ? approveButton : <Trans>ConfirmationModal.Approve</Trans>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
