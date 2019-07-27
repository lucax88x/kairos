import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeEntryModel } from '../models/time-entry.model';
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
  onUpdate: (model: TimeEntryModel) => dispatch(push(`/entry/${model.id}`)),
});

export const TimeEntriesByRange = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesByRangeComponent);
