import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectProfile } from '../profile/selectors';
import { selectIsGetTimeAbsenceEntriesBusy, selectIsGetTimeEntriesBusy, selectIsGetTimeHolidayEntriesBusy, selectSelectedLanguage, selectTimeAbsenceEntries, selectTimeEntries, selectTimeHolidayEntries, selectSelectedYear } from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesCalendarComponent, TimeEntriesCalendarDispatches, TimeEntriesCalendarInputs } from './TimeEntriesCalendar';

const mapStateToProps = (state: State): TimeEntriesCalendarInputs => ({
  profile: selectProfile(state),
  selectedLanguage: selectSelectedLanguage(state),
  selectedYear: selectSelectedYear(state),
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
