import { produce } from 'immer';
import { put, takeLatest, take } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { action } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { CHECK_IS_ONLINE, IS_OFFLINE, IS_ONLINE, STARTS_AS_ONLINE, STARTS_AS_OFFLINE } from './constants';
import { SharedState } from './state';

export const checkIsOnline = () => action(CHECK_IS_ONLINE);
export const startsAsOnline = () => action(STARTS_AS_ONLINE);
export const startsAsOffline = () => action(STARTS_AS_OFFLINE);
export const isOnline = () => action(IS_ONLINE);
export const isOffline = () => action(IS_OFFLINE);

const redirectChannel = channel();

function* initCheckIsOnline() {
  navigator.onLine ? yield put(startsAsOnline()) : yield put(startsAsOffline());

  window.addEventListener(
    'online',
    () => redirectChannel.put(isOnline()),
    false,
  );
  window.addEventListener(
    'offline',
    () => redirectChannel.put(isOffline()),
    false,
  );
}

export function* watchRedirectChannelOnline() {
  while (true) {
    const action = yield take(redirectChannel);
    yield put(action);
  }
}
export function* checkIsOnlineSaga() {
  yield takeLatest(CHECK_IS_ONLINE, initCheckIsOnline);
  yield put(checkIsOnline());
}

export const checkIsOnlineReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case STARTS_AS_ONLINE:
      case IS_ONLINE:
        draft.isOnline = true;
        break;
      case STARTS_AS_OFFLINE:
      case IS_OFFLINE:
        draft.isOnline = false;
        break;
    }
  });
