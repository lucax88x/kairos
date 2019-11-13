import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { selectProfile } from '../profile/selectors';
import { selectIsGetTimeEntriesBusy, selectTimeEntries, selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesByRangeComponent, TimeEntriesByRangeDispatches, TimeEntriesByRangeInputs } from './TimeEntriesByRange';

const mapStateToProps = (state: State): TimeEntriesByRangeInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  profile: selectProfile(state),
  timeEntries: selectTimeEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): TimeEntriesByRangeDispatches => ({
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
});

export const TimeEntriesByRange = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesByRangeComponent);
