import { NotificationModel } from '../models/notification.model';

export interface INotificationManagerState {
  notifications: NotificationModel[];
}

export const notificationManagerInitialState: INotificationManagerState = {
  notifications: [],
};
