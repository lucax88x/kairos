import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { selectIsGetTimeEntriesBusy, selectTimeEntries } from '../shared/selectors';
import { State } from '../state';
import {
  TimeStatisticsComponent,
  TimeStatisticsDispatches,
  TimeStatisticsInputs,
} from './TimeStatistics';

const mapStateToProps = (state: State): TimeStatisticsInputs => ({
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeStatisticsDispatches => ({
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
});

export const TimeStatistics = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeStatisticsComponent);
