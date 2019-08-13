import { connect } from 'react-redux';

import {
  selectIsGetTimeAbsenceEntriesBusy,
  selectIsGetTimeEntriesBusy,
  selectIsGetTimeHolidayEntriesBusy,
  selectTimeAbsenceEntries,
  selectTimeEntries,
  selectTimeHolidayEntries,
} from '../shared/selectors';
import { State } from '../state';
import { TimeEntriesCalendarComponent, TimeEntriesCalendarInputs } from './TimeEntriesCalendar';

const mapStateToProps = (state: State): TimeEntriesCalendarInputs => ({
  isGetTimeEntriesBusy: selectIsGetTimeEntriesBusy(state),
  timeEntries: selectTimeEntries(state),
  isGetTimeAbsenceEntriesBusy: selectIsGetTimeAbsenceEntriesBusy(state),
  timeAbsenceEntries: selectTimeAbsenceEntries(state),
  isGetTimeHolidayEntriesBusy: selectIsGetTimeHolidayEntriesBusy(state),
  timeHolidayEntries: selectTimeHolidayEntries(state),
});

export const TimeEntriesCalendar = connect(mapStateToProps)(TimeEntriesCalendarComponent);
