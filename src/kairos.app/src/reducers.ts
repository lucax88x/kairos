import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

import { dashboardReducers } from './dashboard/reducers';
import { layoutReducers } from './layout/reducers';
import { notificationManagerReducers } from './notification-manager/reducers';
import { sharedReducers } from './shared/reducers';
import { State } from './state';

export const rootReducers = (history: History<any>) =>
  combineReducers<State>({
    router: connectRouter(history),
    layout: layoutReducers,
    shared: sharedReducers,
    notificationManager: notificationManagerReducers,
    dashboard: dashboardReducers,
  });
