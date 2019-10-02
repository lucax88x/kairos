import { connect } from 'react-redux';
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
import { TimeEntriesCalendarComponent, TimeEntriesCalendarInputs } from './TimeEntriesCalendar';

const mapStateToProps = (state: State): TimeEntriesCalendarInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  timeEntries: selectTimeEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeHolidayEntriesBusy: selectIsGetTimeHolidayEntriesBusy(state),
  timeHolidayEntries: selectTimeHolidayEntries(state),
});

export const TimeEntriesCalendar = connect(mapStateToProps)(TimeEntriesCalendarComponent);
