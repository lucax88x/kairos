import './assets/fonts/roboto/index.scss';
import './index.scss';

import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

import { Actions } from './actions';
import { rootReducers } from './reducers';
import { State } from './state';

const logger = createLogger({
  collapsed: true,
});

export const history = createBrowserHistory();

export const store: Store<State, Actions> = createStore<State, Actions, {}, {}>(
  rootReducers(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), logger)),
);
