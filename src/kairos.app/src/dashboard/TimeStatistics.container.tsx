import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { selectProfile } from '../profile/selectors';
import {
  selectIsGetTimeEntriesBusy,
  selectSelectedLanguage,
  selectTimeAbsenceEntries,
  selectTimeEntries,
  selectTimeHolidayEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeStatisticsComponent,
  TimeStatisticsDispatches,
  TimeStatisticsInputs,
} from './TimeStatistics';

const mapStateToProps = (state: State): TimeStatisticsInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  profile: selectProfile(state),
  timeEntries: selectTimeEntries(state),
  absences: selectTimeAbsenceEntries(state),
  holidays: selectTimeHolidayEntries(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeStatisticsDispatches => ({
  onUpdate: (model: TimeEntryListModel) => dispatch(push(`/entry/${model.id}`)),
});

export const TimeStatistics = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeStatisticsComponent);
