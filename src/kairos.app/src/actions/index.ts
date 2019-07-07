import { RouterAction } from 'connected-react-router';

import { NotificationManagerActions } from '../notification-manager';

export type Actions = RouterAction | NotificationManagerActions;
