import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { Actions } from './actions';
import './index.scss';
import { rootReducers } from './reducers';
import { rootSagas } from './sagas';
import { State } from './state';

const logger = createLogger({
  collapsed: true,
});

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routerMiddleware(history), logger];

export const store: Store<State, Actions> = createStore<State, Actions, {}, {}>(
  rootReducers(history),
  composeWithDevTools(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(rootSagas);

export const persistor = persistStore(store);
