import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  selectIsGetTimeAbsenceEntriesBusy,
  selectIsGetTimeEntriesBusy,
  selectIsGetTimeHolidayEntriesBusy,
  selectSelectedLanguage,
  selectTimeAbsenceEntries,
  selectTimeEntries,
  selectTimeHolidayEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeEntriesCalendarComponent,
  TimeEntriesCalendarDispatches,
  TimeEntriesCalendarInputs,
} from './TimeEntriesCalendar';
import { Actions } from '../actions';

const mapStateToProps = (state: State): TimeEntriesCalendarInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  timeEntries: selectTimeEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeHolidayEntriesBusy: selectIsGetTimeHolidayEntriesBusy(state),
  timeHolidayEntries: selectTimeHolidayEntries(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeEntriesCalendarDispatches => ({
  onNavigate: (url: string) => dispatch(push(url)),
});

export const TimeEntriesCalendar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeEntriesCalendarComponent);
