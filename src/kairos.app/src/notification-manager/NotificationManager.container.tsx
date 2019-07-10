import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { UUID } from '../models/uuid.model';
import { selectNotifications } from '../selectors/notification-manager.selectors';
import { State } from '../state';
import {
  NotificationManagerComponent,
  NotificationManagerDispatches,
  NotificationManagerInputs,
} from './NotificationManager';
import { removeSnackbarAction } from './remove-snackbar';

const mapStateToProps = (state: State): NotificationManagerInputs => ({
  notifications: selectNotifications(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): NotificationManagerDispatches => ({
  removeNotification: (key: UUID) => dispatch(removeSnackbarAction(key)),
});

export const NotificationManager = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationManagerComponent);
