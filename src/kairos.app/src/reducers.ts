import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

import { dashboardReducers } from './dashboard/reducers';
import { notificationManagerReducers } from './notification-manager/reducers';
import { State } from './state';

export const rootReducers = (history: History<any>) =>
  combineReducers<State>({
    router: connectRouter(history),
    notificationManager: notificationManagerReducers,
    dashboard: dashboardReducers,
  });
