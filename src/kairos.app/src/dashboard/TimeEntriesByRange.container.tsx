import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { selectIsGetTimeEntriesBusy, selectTimeEntries } from '../shared/selectors';
import { State } from '../state';
import {
  TimeEntriesByRangeComponent,
  TimeEntriesByRangeDispatches,
  TimeEntriesByRangeInputs,
} from './TimeEntriesByRange';

const mapStateToProps = (state: State): TimeEntriesByRangeInputs => ({
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeEntriesByRangeDispatches => ({
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
});

export const TimeEntriesByRange = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesByRangeComponent);
