import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import { AppComponent, AppDispatches, AppInputs } from './App';
import { logout } from './auth/logout';
import { selectUser } from './auth/selectors';
import {
  closeLeftDrawerAction,
  closeTimeAbsenceEntryDrawerAction,
  closeTimeEntryDrawerAction,
  openLeftDrawerAction,
  openTimeAbsenceEntryDrawerAction,
  openTimeEntryDrawerAction,
} from './layout/actions';
import {
  selectIsLeftDrawerOpen,
  selectIsTimeAbsenceEntryDrawerOpen,
  selectIsTimeEntryDrawerOpen,
} from './layout/selectors';
import { State } from './state';

const mapStateToProps = (state: State): AppInputs => ({
  isLeftDrawerOpen: selectIsLeftDrawerOpen(state),
  isTimeEntryDrawerOpen: selectIsTimeEntryDrawerOpen(state),
  isTimeAbsenceEntryDrawerOpen: selectIsTimeAbsenceEntryDrawerOpen(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): AppDispatches => ({
  openLeftDrawer: () => dispatch(openLeftDrawerAction()),
  closeLeftDrawer: () => dispatch(closeLeftDrawerAction()),
  openTimeEntryDrawer: () => dispatch(openTimeEntryDrawerAction()),
  closeTimeEntryDrawer: () => dispatch(closeTimeEntryDrawerAction()),
  openTimeAbsenceEntryDrawer: () => dispatch(openTimeAbsenceEntryDrawerAction()),
  closeTimeAbsenceEntryDrawer: () => dispatch(closeTimeAbsenceEntryDrawerAction()),
  logout: () => dispatch(logout()),
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
