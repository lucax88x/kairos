import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { UUID } from '../models/uuid.model';
import { State } from '../state';
import {
  NotificationManagerComponent,
  NotificationManagerDispatches,
  NotificationManagerInputs,
} from './NotificationManager';
import { removeSnackbarAction } from './remove-snackbar';
import { selectNotifications } from './selectors';

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
