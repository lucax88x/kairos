import { NotificationModel } from '../models/notification.model';

export interface NotificationManagerState {
  notifications: NotificationModel[];
}

export const notificationManagerInitialState: NotificationManagerState = {
  notifications: [],
};
