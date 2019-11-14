import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { refreshAction } from '../shared/refresh';
import {
  selectIsOnline,
  selectSelectedLanguage,
  selectRefreshDate,
} from '../shared/selectors';
import { State } from '../state';
import {
  DashboardHeaderComponent,
  DashboardHeaderDispatches,
  DashboardHeaderInputs,
} from './DashboardHeader';

const mapStateToProps = (state: State): DashboardHeaderInputs => ({
  isOnline: selectIsOnline(state),
  refreshDate: selectRefreshDate(state),
  selectedLanguage: selectSelectedLanguage(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): DashboardHeaderDispatches => ({
  refresh: () => dispatch(refreshAction()),
});

export const DashboardHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardHeaderComponent);
