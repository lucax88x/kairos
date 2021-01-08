import { OptionsObject, withSnackbar, WithSnackbarProps } from 'notistack';
import { forEach, mergeRight } from 'ramda';
import React from 'react';

import { NotificationModel } from '../models/notification.model';
import { UUID } from '../models/uuid.model';

export interface NotificationManagerInputs {
  notifications: NotificationModel[];
}

export interface NotificationManagerDispatches {
  removeNotification: (key: UUID) => void;
}

type NotificationManagerProps = NotificationManagerInputs &
  NotificationManagerDispatches &
  WithSnackbarProps;

class NotificationManager extends React.PureComponent<
  NotificationManagerProps
> {
  private optionDefaults: OptionsObject;

  /**
   *
   */
  constructor(props: NotificationManagerProps) {
    super(props);

    this.optionDefaults = {
      variant: 'info',
    };
  }

  render() {
    return null;
  }

  UNSAFE_componentWillReceiveProps(nextProps: NotificationManagerProps) {
    const { notifications, enqueueSnackbar } = nextProps;

    forEach(notification => {
      // // If notification already displayed, abort
      // if (displayed.indexOf(notification.key) > -1) return;
      // Display notification using notistack

      let options = this.optionDefaults;
      if (!!notification.options) {
        options = mergeRight(this.optionDefaults, notification.options);
      }
      enqueueSnackbar(notification.message, options);

      this.removeSnackbar(notification.key);
    }, notifications);
  }

  private removeSnackbar(key: UUID) {
    this.props.removeNotification(key);
  }
}

export const NotificationManagerComponent = withSnackbar(NotificationManager);
