import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import { AppComponent, AppDispatches, AppInputs } from './App';
import { logout } from './auth/logout';
import { selectUser } from './auth/selectors';
import {
  closeLeftDrawerAction,
  closeRightDrawerAction,
  openLeftDrawerAction,
  openRightDrawerAction,
} from './layout/actions';
import { selectIsLeftDrawerOpen, selectIsRightDrawerOpen } from './layout/selectors';
import { State } from './state';

const mapStateToProps = (state: State): AppInputs => ({
  isLeftDrawerOpen: selectIsLeftDrawerOpen(state),
  isRightDrawerOpen: selectIsRightDrawerOpen(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): AppDispatches => ({
  openLeftDrawer: () => dispatch(openLeftDrawerAction()),
  closeLeftDrawer: () => dispatch(closeLeftDrawerAction()),
  openRightDrawer: () => dispatch(openRightDrawerAction()),
  closeRightDrawer: () => dispatch(closeRightDrawerAction()),
  logout: () => dispatch(logout()),
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
