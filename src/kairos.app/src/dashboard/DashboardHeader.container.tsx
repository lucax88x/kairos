import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { refreshAction } from '../shared/actions';
import {
  selectIsOnline,
  selectIsRefreshBusy,
  selectRefreshDate,
  selectSelectedLanguage,
} from '../shared/selectors';
import { State } from '../state';
import {
  DashboardHeaderComponent,
  DashboardHeaderDispatches,
  DashboardHeaderInputs,
} from './DashboardHeader';

const mapStateToProps = (state: State): DashboardHeaderInputs => ({
  isBusy: selectIsRefreshBusy(state),
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
