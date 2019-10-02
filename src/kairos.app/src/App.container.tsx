import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from './actions';
import { AppComponent, AppDispatches, AppInputs } from './App';
import { logout } from './auth/logout';
import { selectUser } from './auth/selectors';
import { closeLeftDrawerAction, closeTimeAbsenceEntryDrawerAction, closeTimeEntryDrawerAction, openLeftDrawerAction, openTimeAbsenceEntryDrawerAction, openTimeEntryDrawerAction, openRightDrawerAction, closeRightDrawerAction } from './layout/actions';
import { selectIsLeftDrawerOpen, selectIsTimeAbsenceEntryDrawerOpen, selectIsTimeEntryDrawerOpen, selectIsRightDrawerOpen } from './layout/selectors';
import { Language } from './models/language-model';
import { Routes } from './routes';
import { selectYear } from './shared/actions';
import { selectLanguage } from './shared/select-language';
import { selectSelectedLanguage, selectSelectedYear } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): AppInputs => ({
  user: selectUser(state),
  selectedLanguage: selectSelectedLanguage(state),
  selectedYear: selectSelectedYear(state),
  isLeftDrawerOpen: selectIsLeftDrawerOpen(state),
  isRightDrawerOpen: selectIsRightDrawerOpen(state),
  isTimeEntryDrawerOpen: selectIsTimeEntryDrawerOpen(state),
  isTimeAbsenceEntryDrawerOpen: selectIsTimeAbsenceEntryDrawerOpen(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): AppDispatches => ({
  onSelectYear: (year: number) => dispatch(selectYear(year)),
  onSelectLanguage: (language: Language) => dispatch(selectLanguage(language)),
  openLeftDrawer: () => dispatch(openLeftDrawerAction()),
  closeLeftDrawer: () => dispatch(closeLeftDrawerAction()),
  openRightDrawer: () => dispatch(openRightDrawerAction()),
  closeRightDrawer: () => dispatch(closeRightDrawerAction()),
  openTimeEntryDrawer: () => dispatch(openTimeEntryDrawerAction()),
  closeTimeEntryDrawer: () => dispatch(closeTimeEntryDrawerAction()),
  openTimeAbsenceEntryDrawer: () => dispatch(openTimeAbsenceEntryDrawerAction()),
  closeTimeAbsenceEntryDrawer: () => dispatch(closeTimeAbsenceEntryDrawerAction()),
  onLogout: () => dispatch(logout()),
  onNavigateToProfile: () => dispatch(push(Routes.Profile)),
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
